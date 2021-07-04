use super::{
    structure::{StructureBundle, StructureComponents},
    FactorishState, FrameProcResult, Position,
};
use serde::{Deserialize, Serialize};
use specs::{Builder, Component, DenseVecStorage, Entity, World, WorldExt};
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

use std::cmp::Eq;

#[derive(Eq, PartialEq, Clone, Copy, Debug, Serialize, Deserialize)]
pub(crate) enum FluidType {
    Water,
    Steam,
}

#[derive(Serialize, Deserialize)]
pub(crate) struct FluidBox {
    pub type_: Option<FluidType>,
    pub amount: f64,
    pub max_amount: f64,
    pub input_enable: bool,
    pub output_enable: bool,
    #[serde(skip)]
    pub connect_to: [Option<Entity>; 4],
    pub filter: Option<FluidType>, // permits undefined
}

type Connection = (Entity, Entity);

impl FluidBox {
    pub(crate) fn new(input_enable: bool, output_enable: bool) -> Self {
        Self {
            type_: None,
            amount: 0.,
            max_amount: 100.,
            input_enable,
            output_enable,
            connect_to: [None; 4],
            filter: None,
        }
    }

    pub(super) fn set_type(mut self, type_: &FluidType) -> Self {
        self.type_ = Some(*type_);
        self
    }

    pub(crate) fn desc(&self) -> String {
        let amount_ratio = self.amount / self.max_amount * 100.;
        // Progress bar
        format!("{}{}{}",
            format!("{}: {:.0}%<br>", self.type_.map(|v| format!("{:?}", v)).unwrap_or_else(|| "None".to_string()), amount_ratio),
            "<div style='position: relative; width: 100px; height: 10px; background-color: #001f1f; margin: 2px; border: 1px solid #3f3f3f'>",
            format!("<div style='position: absolute; width: {}px; height: 10px; background-color: #ff00ff'></div></div>",
                amount_ratio),
            )
    }

    pub(crate) fn list_connections(world: &World) -> Vec<Connection> {
        use specs::Join;
        let entities = world.entities();
        let positions = world.read_component::<Position>();
        let ofb = world.read_component::<OutputFluidBox>();
        let mut ret = vec![];
        for (entity, position, output_fluid_box) in (&entities, &positions, &ofb).join() {
            for (entity2, position2, output_fluid_box2) in (&entities, &positions, &ofb).join() {
                if (position.x - position2.x).abs() <= 1 && (position.y - position2.y).abs() <= 1 {
                    ret.push((entity, entity2));
                }
            }
        }
        ret
    }

    pub(crate) fn update_connections(
        &mut self,
        entity: Entity,
        connections: &[Connection],
    ) -> Result<(), JsValue> {
        let mut idx = 0;
        for (_, to) in connections.iter().filter(|(from, to)| *from == entity) {
            if idx < self.connect_to.len() {
                self.connect_to[idx] = Some(*to);
            } else {
                return Err(js_str!("More than 4 connections in a fluid box!"));
            }
        }
        Ok(())
    }

    pub(crate) fn simulate(&mut self, position: &Position, state: &FactorishState, world: &World) {
        let mut _biggest_flow_idx = -1;
        let mut biggest_flow_amount = 1e-3; // At least this amount of flow is required for displaying flow direction
                                            // In an unlikely event, a fluid box without either input or output ports has nothing to do
        if self.amount == 0. || !self.input_enable && !self.output_enable {
            return;
        }
        let rel_dir = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        // let connect_list = self
        //     .connect_to
        //     .iter()
        //     .enumerate()
        //     .map(|(i, c)| (i, *c))
        //     .filter(|(_, c)| *c)
        //     .collect::<Vec<_>>();
        let connect_to = self.connect_to;
        for (i, connect) in connect_to.iter().copied().enumerate() {
            let connect = if let Some(connect) = connect {
                connect
            } else {
                continue;
            };
            let mut input_fluid_box_storage = world.write_component::<InputFluidBox>();
            let input_fluid_box = input_fluid_box_storage.get_mut(connect);
            let input_fluid_box = if let Some(input_fluid_box) = input_fluid_box {
                input_fluid_box
            } else {
                continue;
            };
            // let dir_idx = i % 4;
            // let pos = Position {
            //     x: position.x + rel_dir[dir_idx][0],
            //     y: position.y + rel_dir[dir_idx][1],
            // };
            // if pos.x < 0 || state.width <= pos.x as u32 || pos.y < 0 || state.height <= pos.y as u32
            // {
            //     continue;
            // }
            // if let Some(structure) = structures
            //     .map(|s| s)
            //     .find(|s| s.components.position == Some(pos))
            // {
            let mut process_fluid_box = |self_box: &mut FluidBox, fluid_box: &mut FluidBox| {
                // Different types of fluids won't mix
                if 0. < fluid_box.amount
                    && fluid_box.type_ != self_box.type_
                    && fluid_box.type_.is_some()
                {
                    return;
                }
                let pressure = fluid_box.amount - self_box.amount;
                let flow = pressure * 0.1;
                // Check input/output valve state
                if if flow < 0. {
                    !self_box.output_enable
                        || !fluid_box.input_enable
                        || fluid_box.filter.is_some() && fluid_box.filter != self_box.type_
                } else {
                    !self_box.input_enable
                        || !fluid_box.output_enable
                        || self_box.filter.is_some() && self_box.filter != fluid_box.type_
                } {
                    return;
                }
                fluid_box.amount -= flow;
                self_box.amount += flow;
                if flow < 0. {
                    fluid_box.type_ = self_box.type_;
                } else {
                    self_box.type_ = fluid_box.type_;
                }
                if biggest_flow_amount < flow.abs() {
                    biggest_flow_amount = flow;
                    _biggest_flow_idx = i as isize;
                }
            };
            // if let Some(fluid_boxes) = structure.dynamic.fluid_box_mut() {
            // for fluid_box in fluid_boxes {
            process_fluid_box(self, &mut input_fluid_box.0);
            // }
            // }
            // }
        }
    }
}

#[derive(Serialize, Deserialize, Component)]
pub(crate) struct InputFluidBox(pub FluidBox);

#[derive(Serialize, Deserialize, Component)]
pub(crate) struct OutputFluidBox(pub FluidBox);
