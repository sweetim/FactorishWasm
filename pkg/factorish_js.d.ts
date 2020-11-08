/* tslint:disable */
/* eslint-disable */
/**
*/
export function greet(): void;
/**
* @param {number} x
* @param {number} y
* @param {number} bit
* @returns {number}
*/
export function perlin_noise_pixel(x: number, y: number, bit: number): number;
/**
*/
export class FactorishState {
  free(): void;
/**
* @param {Function} on_player_update
*/
  constructor(on_player_update: Function);
/**
* @param {number} delta_time
* @returns {Array<any>}
*/
  simulate(delta_time: number): Array<any>;
/**
* Returns [[itemName, itemCount]*, selectedItemName]
* @returns {Array<any>}
*/
  get_player_inventory(): Array<any>;
/**
* @param {string} name
*/
  select_player_inventory(name: string): void;
/**
* @param {number} c
* @param {number} r
*/
  open_structure_inventory(c: number, r: number): void;
/**
* @returns {any}
*/
  get_selected_inventory(): any;
/**
* @param {number} c
* @param {number} r
* @returns {Array<any>}
*/
  get_structure_inventory(c: number, r: number): Array<any>;
/**
* @param {string} name
*/
  select_structure_inventory(name: string): void;
/**
* @param {boolean} to_player
* @returns {boolean}
*/
  move_selected_inventory_item(to_player: boolean): boolean;
/**
* @param {Float64Array} pos
* @param {number} button
* @returns {any}
*/
  mouse_down(pos: Float64Array, button: number): any;
/**
* @param {Float64Array} pos
*/
  mouse_move(pos: Float64Array): void;
/**
*/
  mouse_leave(): void;
/**
* @param {number} key_code
* @returns {boolean}
*/
  on_key_down(key_code: number): boolean;
/**
* @param {HTMLCanvasElement} canvas
* @param {HTMLDivElement} info_elem
* @param {Array<any>} image_assets
*/
  render_init(canvas: HTMLCanvasElement, info_elem: HTMLDivElement, image_assets: Array<any>): void;
/**
* @returns {Array<any>}
*/
  tool_defs(): Array<any>;
/**
* Returns 2-array with [selected_tool, inventory_count]
* @returns {Array<any>}
*/
  selected_tool(): Array<any>;
/**
* @param {number} tool_index
* @param {CanvasRenderingContext2D} context
*/
  render_tool(tool_index: number, context: CanvasRenderingContext2D): void;
/**
* @param {number} tool
* @returns {boolean}
*/
  select_tool(tool: number): boolean;
/**
* @returns {number}
*/
  rotate_tool(): number;
/**
* @returns {Array<any>}
*/
  tool_inventory(): Array<any>;
/**
* @param {CanvasRenderingContext2D} context
*/
  render(context: CanvasRenderingContext2D): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly greet: () => void;
  readonly __wbg_factorishstate_free: (a: number) => void;
  readonly factorishstate_new: (a: number) => number;
  readonly factorishstate_simulate: (a: number, b: number) => number;
  readonly factorishstate_get_player_inventory: (a: number) => number;
  readonly factorishstate_select_player_inventory: (a: number, b: number, c: number) => void;
  readonly factorishstate_open_structure_inventory: (a: number, b: number, c: number) => void;
  readonly factorishstate_get_selected_inventory: (a: number) => number;
  readonly factorishstate_get_structure_inventory: (a: number, b: number, c: number) => number;
  readonly factorishstate_select_structure_inventory: (a: number, b: number, c: number) => void;
  readonly factorishstate_move_selected_inventory_item: (a: number, b: number) => number;
  readonly factorishstate_mouse_down: (a: number, b: number, c: number, d: number) => number;
  readonly factorishstate_mouse_move: (a: number, b: number, c: number) => void;
  readonly factorishstate_mouse_leave: (a: number) => void;
  readonly factorishstate_on_key_down: (a: number, b: number) => number;
  readonly factorishstate_render_init: (a: number, b: number, c: number, d: number) => void;
  readonly factorishstate_tool_defs: (a: number) => number;
  readonly factorishstate_selected_tool: (a: number) => number;
  readonly factorishstate_render_tool: (a: number, b: number, c: number) => void;
  readonly factorishstate_select_tool: (a: number, b: number) => number;
  readonly factorishstate_rotate_tool: (a: number) => number;
  readonly factorishstate_tool_inventory: (a: number) => number;
  readonly factorishstate_render: (a: number, b: number) => void;
  readonly perlin_noise_pixel: (a: number, b: number, c: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
        