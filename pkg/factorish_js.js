
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
/**
*/
export function greet() {
    wasm.greet();
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8);
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {number} x
* @param {number} y
* @param {number} bit
* @returns {number}
*/
export function perlin_noise_pixel(x, y, bit) {
    var ret = wasm.perlin_noise_pixel(x, y, bit);
    return ret;
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}
/**
*/
export class FactorishState {

    static __wrap(ptr) {
        const obj = Object.create(FactorishState.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_factorishstate_free(ptr);
    }
    /**
    * @param {Function} on_player_update
    */
    constructor(on_player_update) {
        var ret = wasm.factorishstate_new(addHeapObject(on_player_update));
        return FactorishState.__wrap(ret);
    }
    /**
    * @param {number} delta_time
    * @returns {Array<any>}
    */
    simulate(delta_time) {
        var ret = wasm.factorishstate_simulate(this.ptr, delta_time);
        return takeObject(ret);
    }
    /**
    * Returns [[itemName, itemCount]*, selectedItemName]
    * @returns {Array<any>}
    */
    get_player_inventory() {
        var ret = wasm.factorishstate_get_player_inventory(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {string} name
    */
    select_player_inventory(name) {
        var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.factorishstate_select_player_inventory(this.ptr, ptr0, len0);
    }
    /**
    * @param {number} c
    * @param {number} r
    */
    open_structure_inventory(c, r) {
        wasm.factorishstate_open_structure_inventory(this.ptr, c, r);
    }
    /**
    * @returns {any}
    */
    get_selected_inventory() {
        var ret = wasm.factorishstate_get_selected_inventory(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {number} c
    * @param {number} r
    * @returns {Array<any>}
    */
    get_structure_inventory(c, r) {
        var ret = wasm.factorishstate_get_structure_inventory(this.ptr, c, r);
        return takeObject(ret);
    }
    /**
    * @param {string} name
    */
    select_structure_inventory(name) {
        var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.factorishstate_select_structure_inventory(this.ptr, ptr0, len0);
    }
    /**
    * @param {boolean} to_player
    * @returns {boolean}
    */
    move_selected_inventory_item(to_player) {
        var ret = wasm.factorishstate_move_selected_inventory_item(this.ptr, to_player);
        return ret !== 0;
    }
    /**
    * @param {Float64Array} pos
    * @param {number} button
    * @returns {any}
    */
    mouse_down(pos, button) {
        var ptr0 = passArrayF64ToWasm0(pos, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.factorishstate_mouse_down(this.ptr, ptr0, len0, button);
        return takeObject(ret);
    }
    /**
    * @param {Float64Array} pos
    */
    mouse_move(pos) {
        var ptr0 = passArrayF64ToWasm0(pos, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.factorishstate_mouse_move(this.ptr, ptr0, len0);
    }
    /**
    */
    mouse_leave() {
        wasm.factorishstate_mouse_leave(this.ptr);
    }
    /**
    * @param {number} key_code
    * @returns {boolean}
    */
    on_key_down(key_code) {
        var ret = wasm.factorishstate_on_key_down(this.ptr, key_code);
        return ret !== 0;
    }
    /**
    * @param {HTMLCanvasElement} canvas
    * @param {HTMLDivElement} info_elem
    * @param {Array<any>} image_assets
    */
    render_init(canvas, info_elem, image_assets) {
        wasm.factorishstate_render_init(this.ptr, addHeapObject(canvas), addHeapObject(info_elem), addHeapObject(image_assets));
    }
    /**
    * @returns {Array<any>}
    */
    tool_defs() {
        var ret = wasm.factorishstate_tool_defs(this.ptr);
        return takeObject(ret);
    }
    /**
    * Returns 2-array with [selected_tool, inventory_count]
    * @returns {Array<any>}
    */
    selected_tool() {
        var ret = wasm.factorishstate_selected_tool(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {number} tool_index
    * @param {CanvasRenderingContext2D} context
    */
    render_tool(tool_index, context) {
        try {
            wasm.factorishstate_render_tool(this.ptr, tool_index, addBorrowedObject(context));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {number} tool
    * @returns {boolean}
    */
    select_tool(tool) {
        var ret = wasm.factorishstate_select_tool(this.ptr, tool);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    rotate_tool() {
        var ret = wasm.factorishstate_rotate_tool(this.ptr);
        return ret;
    }
    /**
    * @returns {Array<any>}
    */
    tool_inventory() {
        var ret = wasm.factorishstate_tool_inventory(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {CanvasRenderingContext2D} context
    */
    render(context) {
        wasm.factorishstate_render(this.ptr, addHeapObject(context));
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_number_new = function(arg0) {
        var ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_log_ce4e0a32afc81109 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_alert_f68d8f5b43fe3ff8 = function(arg0, arg1) {
        alert(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        var ret = getObject(arg0) === getObject(arg1);
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_adf3196bdc02b386 = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_instanceof_ImageBitmap_8c30988d6e9d289e = function(arg0) {
        var ret = getObject(arg0) instanceof ImageBitmap;
        return ret;
    };
    imports.wbg.__wbg_setinnerHTML_4ff235db1a3cb4d8 = function(arg0, arg1, arg2) {
        getObject(arg0).innerHTML = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setglobalAlpha_b88eed33e546d000 = function(arg0, arg1) {
        getObject(arg0).globalAlpha = arg1;
    };
    imports.wbg.__wbg_setstrokeStyle_ab391a0f9102e10c = function(arg0, arg1) {
        getObject(arg0).strokeStyle = getObject(arg1);
    };
    imports.wbg.__wbg_setlineWidth_85798545cf8a1f9d = function(arg0, arg1) {
        getObject(arg0).lineWidth = arg1;
    };
    imports.wbg.__wbg_drawImage_9d026fb177bddaf0 = handleError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).drawImage(getObject(arg1), arg2, arg3);
    });
    imports.wbg.__wbg_drawImage_1459e66a0e52fbef = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).drawImage(getObject(arg1), arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
    });
    imports.wbg.__wbg_clearRect_d61bc1791ebc06b1 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).clearRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_strokeRect_6f15f1e147787672 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).strokeRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_restore_be383cadf1440d72 = function(arg0) {
        getObject(arg0).restore();
    };
    imports.wbg.__wbg_save_6d43ca6041c1ddb6 = function(arg0) {
        getObject(arg0).save();
    };
    imports.wbg.__wbg_rotate_1fae86d712dcdfd3 = handleError(function(arg0, arg1) {
        getObject(arg0).rotate(arg1);
    });
    imports.wbg.__wbg_translate_458add1387a34577 = handleError(function(arg0, arg1, arg2) {
        getObject(arg0).translate(arg1, arg2);
    });
    imports.wbg.__wbg_width_a22f9855caa54b53 = function(arg0) {
        var ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_height_9a404a6b3c61c7ef = function(arg0) {
        var ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_get_27693110cb44e852 = function(arg0, arg1) {
        var ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_079c4e509ec6d375 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_new_e13110f81ae347cf = function() {
        var ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_from_2a5d647e62275bfd = function(arg0) {
        var ret = Array.from(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_of_61aa6827ec81b617 = function(arg0) {
        var ret = Array.of(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_of_de6ee285099ec772 = function(arg0, arg1) {
        var ret = Array.of(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_of_c0fdee514e26e119 = function(arg0, arg1, arg2) {
        var ret = Array.of(getObject(arg0), getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_push_b46eeec52d2b03bb = function(arg0, arg1) {
        var ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_newnoargs_f3b8a801d5d4b079 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_8e95613cc6524977 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_call_d713ea0274dfc6d2 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_self_07b2f89e82ceb76d = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_window_ba85d88572adc0dc = handleError(function() {
        var ret = window.window;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_globalThis_b9277fc37e201fe5 = handleError(function() {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_global_e16303fe83e1d57f = handleError(function() {
        var ret = global.global;
        return addHeapObject(ret);
    });
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw takeObject(arg0);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

