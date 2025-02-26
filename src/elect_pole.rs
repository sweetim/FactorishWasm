use super::{structure::Structure, FactorishState, Position};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

#[derive(Serialize, Deserialize)]
pub(crate) struct ElectPole {
    position: Position,
    power: f64,
}

impl ElectPole {
    pub(crate) fn new(position: &Position) -> Self {
        ElectPole {
            position: *position,
            power: 0.,
        }
    }
}

impl Structure for ElectPole {
    fn name(&self) -> &str {
        "Electric Pole"
    }

    fn position(&self) -> &Position {
        &self.position
    }

    fn draw(
        &self,
        state: &FactorishState,
        context: &CanvasRenderingContext2d,
        depth: i32,
        _is_toolbar: bool,
    ) -> Result<(), JsValue> {
        if depth != 0 {
            return Ok(());
        };
        let position = self.position;
        let (x, y) = (position.x as f64 * 32., position.y as f64 * 32.);
        match state.image_elect_pole.as_ref() {
            Some(img) => {
                // let (front, mid) = state.structures.split_at_mut(i);
                // let (center, last) = mid
                //     .split_first_mut()
                //     .ok_or(JsValue::from_str("Structures split fail"))?;

                // We could split and chain like above, but we don't have to, as long as we deal with immutable
                // references.
                context.draw_image_with_image_bitmap(&img.bitmap, x, y)?;
            }
            None => return Err(JsValue::from_str("elect-pole image not available")),
        }
        Ok(())
    }

    fn power_sink(&self) -> bool {
        true
    }

    fn power_source(&self) -> bool {
        true
    }

    fn power_outlet(&mut self, demand: f64) -> Option<f64> {
        let power = demand.min(self.power);
        self.power -= power;
        Some(power)
    }

    fn wire_reach(&self) -> u32 {
        5
    }

    crate::serialize_impl!();
}
