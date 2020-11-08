import init, { FactorishState } from "../pkg/factorish_js.js";

/// We may no longer need support for IE, since WebAssembly is not supported by IE anyway.
function isIE(){
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    return msie > 0 || trident > 0;
}

window.onload = async function(){
    await init();
    let sim = new FactorishState(updateInventory);

    const canvas = document.getElementById('canvas');
    const canvasSize = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('container2');
    const containerRect = container.getBoundingClientRect();
    const inventoryElem = document.getElementById('inventory2');

    const infoElem = document.createElement('div');
    infoElem.style.position = 'absolute';
    infoElem.style.backgroundColor = '#ffff7f';
    infoElem.style.border = '1px solid #00f';
    container.appendChild(infoElem);

    var selectedInventory = null;
    var selectedInventoryItem = null;

    const tilesize = 32;
    const textType = isIE() ? "Text" : "text/plain";
    var windowZIndex = 1000;
    const objViewSize = tilesize / 2; // View size is slightly greater than hit detection radius
    let inventoryTarget = null;
    const tableMargin = 10.;
    const miniMapSize = 200;
    const miniMapElem = document.createElement('div');
    miniMapElem.style.position = 'absolute';
    miniMapElem.style.border = '1px solid #000';
    miniMapElem.onclick = function(evt){
        var rect = this.getBoundingClientRect();
        scrollPos[0] = Math.min(xsize - viewPortWidth - 1, Math.max(0, Math.floor((evt.clientX - rect.left) / rect.width * xsize - viewPortWidth / 2.)));
        scrollPos[1] = Math.min(ysize - viewPortHeight - 1, Math.max(0, Math.floor((evt.clientY - rect.top) / rect.height * ysize - viewPortHeight / 2.)));
        updateAllTiles();
    };
    container.appendChild(miniMapElem);
    miniMapElem.style.width = miniMapSize + 'px';
    miniMapElem.style.height = miniMapSize + 'px';
    miniMapElem.style.left = (canvasSize.right - containerRect.left + tableMargin) + 'px';
    miniMapElem.style.top = (canvasSize.top - containerRect.top) + 'px';
    const mrect = miniMapElem.getBoundingClientRect();

    infoElem.style.left = (canvasSize.right + tableMargin) + 'px';
    infoElem.style.top = (mrect.bottom - containerRect.top + tableMargin) + 'px';
    infoElem.style.width = miniMapSize + 'px';
    infoElem.style.height = (canvasSize.height - mrect.height - tableMargin) + 'px';
    infoElem.style.textAlign = 'left';

    var toolDefs = sim.tool_defs();
    var toolElems = [];
    var toolOverlays = [];
    var toolCursorElem;
    // Tool bar
    var toolBarElem = document.createElement('div');
    toolBarElem.style.borderStyle = 'solid';
    toolBarElem.style.borderWidth = '1px';
    toolBarElem.style.borderColor = 'red';
    toolBarElem.style.position = 'relative';
    toolBarElem.margin = '3px';
    toolBarElem.style.left = '50%';
    toolBarElem.style.width = ((toolDefs.length + 1) * tilesize + 8) + 'px';
    toolBarElem.style.height = (tilesize + 8) + 'px';
    container.appendChild(toolBarElem);
    var toolBarCanvases = [];
    for(var i = 0; i < toolDefs.length; i++){
        var toolContainer = document.createElement('span');
        toolContainer.style.position = 'absolute';
        toolContainer.style.display = 'inline-block';
        toolContainer.style.width = '31px';
        toolContainer.style.height = '31px';
        toolContainer.style.top = '4px';
        toolContainer.style.left = (32.0 * i + 4) + 'px';
        toolContainer.style.border = '1px black solid';

        // Overlay for item count
        var overlay = document.createElement('div');
        toolOverlays.push(overlay);
        overlay.setAttribute('class', 'overlay noselect');
        overlay.innerHTML = '0';

        var toolElem = document.createElement("canvas");
        toolElems.push(toolElem);
        toolElem.width = 32;
        toolElem.height = 32;
        toolElem.style.left = '0px';
        toolElem.style.top = '0px';
        toolElem.style.width = '31px';
        toolElem.style.height = '31px';
        toolElem.style.position = 'absolute';
        toolElem.style.textAlign = 'center';
        toolElem.onmousedown = function(e){
            var currentTool = toolElems.indexOf(this);
            var state = sim.select_tool(currentTool);
            if(!toolCursorElem){
                toolCursorElem = document.createElement('div');
                toolCursorElem.style.border = '2px blue solid';
                toolCursorElem.style.pointerEvents = 'none';
                toolBarElem.appendChild(toolCursorElem);
            }
            toolCursorElem.style.position = 'absolute';
            toolCursorElem.style.top = '4px';
            toolCursorElem.style.left = (tilesize * currentTool + 4) + 'px';
            toolCursorElem.style.width = '30px';
            toolCursorElem.style.height = '30px';
            toolCursorElem.style.display = state ? 'block' : 'none';
        }
        toolElem.onmouseenter = function(e){
            var idx = toolElems.indexOf(this);
            if(idx < 0 || toolDefs.length <= idx)
                return;
            var tool = toolDefs[idx];
            // var r = this.getBoundingClientRect();
            // var cr = container.getBoundingClientRect();
            // toolTip.style.left = (r.left - cr.left) + 'px';
            // toolTip.style.top = (r.bottom - cr.top) + 'px';
            // toolTip.style.display = 'block';
            // var desc = tool.prototype.toolDesc();
            // if(0 < desc.length)
            //     desc = '<br>' + desc;
            // toolTip.innerHTML = '<b>' + tool.prototype.name + '</b>' + desc;
        };
        toolElem.onmouseleave = function(e){
            // toolTip.style.display = 'none';
        };
        toolContainer.appendChild(toolElem);
        toolBarCanvases.push(toolElem);
        toolContainer.appendChild(overlay);
        toolBarElem.appendChild(toolContainer);
    }
    var rotateButton = document.createElement('div');
    rotateButton.style.width = '31px';
    rotateButton.style.height = '31px';
    rotateButton.style.position = 'relative';
    rotateButton.style.top = '4px';
    rotateButton.style.left = (32.0 * i + 4) + 'px';
    rotateButton.style.border = '1px blue solid';
    rotateButton.style.backgroundImage = 'url("img/rotate.png")';
    rotateButton.onmousedown = function(e){
        rotate();
    }
    toolBarElem.appendChild(rotateButton);
    // Set the margin after contents are initialized
    toolBarElem.style.marginLeft = (-(toolBarElem.getBoundingClientRect().width + miniMapSize + tableMargin) / 2) + 'px';

    sim.render_init(canvas, infoElem);

    updateToolBarImage();

    function updateToolBarImage(){
        for(var i = 0; i < toolBarCanvases.length; i++){
            var canvasElem = toolBarCanvases[i];
            var context = canvasElem.getContext('2d');
            sim.render_tool(i, context);
        }
    }

    function rotate(){
        var newRotation = sim.rotate_tool();
        updateToolBarImage();
    }

    function updateToolBar(){
        var inventory = sim.tool_inventory();
        for(var i = 0; i < inventory.length; i++)
            toolOverlays[i].innerHTML = inventory[i];
    }

    function getImageFile(type){
        switch(type){
        case 'time':
            return 'img/time.png';
        case 'Iron Ore':
            return 'img/ore.png';
        case 'Iron Plate':
            return 'img/metal.png';
        case 'Steel Plate':
            return 'img/steel-plate.png';
        case 'Copper Ore':
            return 'img/copper-ore.png';
        case 'Copper Plate':
            return 'img/copper-plate.png';
        case 'Coal Ore':
            return 'img/coal-ore.png';
        case 'Gear':
            return 'img/gear.png';
        case 'Copper Wire':
            return 'img/copper-wire.png';
        case 'Circuit':
            return 'img/circuit.png';
        case 'Transport Belt':
            return 'img/transport.png';
        case 'Splitter':
            return 'img/splitter.png';
        case 'Inserter':
            return 'img/inserter-base.png';
        case 'Chest':
            return 'img/chest.png';
        case 'Ore Mine':
            return "img/mine.png";
        case 'Furnace':
            return ["img/furnace.png", 3];
        case 'Assembler':
            return "img/assembler.png";
        case 'Water Well':
            return "img/waterwell.png";
        case 'Boiler':
            return ["img/boiler.png", 3];
        case 'Pipe':
            return "img/pipe-item.png";
        case 'SteamEngine':
            return "img/steam-engine.png";
        default:
            return "";
        }
    }

    function updateInventory(inventory){
        updateInventoryInt(playerInventoryElem, sim, false, inventory);
    }

    function updateStructureInventory(x, y){
        updateInventoryInt(document.getElementById('inventory2Content'), sim, false, sim.get_structure_inventory(x, y));
    }

    function generateItemImage(i, iconSize, count){
        var img = document.createElement('div');
        var imageFile = getImageFile(i);
        img.style.backgroundImage = 'url(' + (imageFile instanceof Array ?
            imageFile[0] : imageFile) + ')';
        var size = iconSize ? 32 : objViewSize;
        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.display = 'inline-block';
        if(imageFile instanceof Array)
            img.style.backgroundSize = size * imageFile[1] + 'px ' + size + 'px';
        else
            img.style.backgroundSize = size + 'px ' + size + 'px';
        img.setAttribute('draggable', 'false');
        if(iconSize && count){
            var container = document.createElement('span');
            container.style.position = 'relative';
            container.style.display = 'inline-block';
            container.style.width = size + 'px';
            container.style.height = size + 'px';
            container.appendChild(img);
            var overlay = document.createElement('div');
            overlay.setAttribute('class', 'overlay noselect');
            overlay.innerHTML = count;
            container.appendChild(overlay);
            return container;
        }
        return img;
    }

    function updateInventoryInt(elem, owner, icons, [inventory, selectedInventoryItem]){
        // Local function to update DOM elements based on selection
        function updateInventorySelection(elem){
            for(var i = 0; i < elem.children.length; i++){
                var celem = elem.children[i];
                celem.style.backgroundColor =
                    celem.itemName === selectedInventoryItem ? "#00ffff" : "";
            }
        }
    
        // Clear the elements first
        while(elem.firstChild)
            elem.removeChild(elem.firstChild);

        for(var i in inventory){
            var [name, v] = inventory[i];
            var div;
            if(icons){
                div = generateItemImage(name, true, v);
            }
            else{
                div = document.createElement('div');
                div.appendChild(generateItemImage(name));
                var text = document.createElement('span');
                text.innerHTML = v + ' ' + name;
                div.appendChild(text);
                div.style.textAlign = 'left';
            }
            if(selectedInventory === owner && selectedInventoryItem === name)
                div.style.backgroundColor = '#00ffff';
            div.setAttribute('class', 'noselect');
            div.itemName = name;
            div.itemAmount = v;
            div.onclick = function(){
                selectedInventory = owner;
                selectedInventoryItem = this.itemName;
                if(elem === playerInventoryElem){
                    sim.select_player_inventory(selectedInventoryItem);
                }
                else{
                    sim.select_structure_inventory(selectedInventoryItem);
                }
                updateInventorySelection(elem);
                // if(inventoryTarget && inventoryTarget.inventory)
                //     updateInventorySelection(document.getElementById('inventoryContent'), inventoryTarget);
            };
            div.setAttribute('draggable', 'true');
            div.ondragstart = function(ev){
                console.log("dragStart");
                ev.dataTransfer.dropEffect = 'move';
                // Encode information to determine item to drop into a JSON
                ev.dataTransfer.setData(textType, JSON.stringify(
                    {type: ev.target.itemName, fromPlayer: elem === playerInventoryElem}));
            };
            elem.appendChild(div);
        }
    }

    inventoryElem.ondragover = function(ev){
        var ok = false;
        for(var i = 0; i < ev.dataTransfer.types.length; i++){
            if(ev.dataTransfer.types[i].toUpperCase() === textType.toUpperCase())
                ok = true;
        }
        if(ok){
            ev.preventDefault();
            // Set the dropEffect to move
            ev.dataTransfer.dropEffect = "move";
        }
    }
    inventoryElem.ondrop = function(ev){
        ev.preventDefault();
        var data = JSON.parse(ev.dataTransfer.getData(textType));
        if(inventoryTarget && data.fromPlayer){
            // The amount could have changed during dragging, so we'll query current value
            // from the source inventory.
            if(sim.move_inventory_item_to_structure(inventoryTarget, data.type)){
                updateInventory(sim.get_player_inventory());
                updateStructureInventory(...inventoryTarget);
            }
            // var movedAmount = inventoryTarget.addItem({type: data.type, amount: fromInventory[data.type]});
            // if(0 < movedAmount){
            //     player.removeItem(data.type, movedAmount);
            //     updatePlayer();
            // }
        }
    }
    inventoryElem.style.display = 'none';
    const inventory2CloseButton = document.getElementById("inventory2CloseButton");
    inventory2CloseButton.addEventListener("click", function(){
        inventoryElem.style.display = "none";
    });

    function dragWindowMouseDown(evt,elem,pos){
        pos = [evt.screenX, evt.screenY];
        bringToTop(elem);
        var mousecaptorElem = document.getElementById('mousecaptor');
        mousecaptorElem.style.display = 'block';

        // Dragging moves windows
        function mousemove(evt){
            if(!pos)
                return;
            var containerElem = document.getElementById('container');
            var cr = containerElem.getBoundingClientRect();
            var rel = [evt.screenX - pos[0], evt.screenY - pos[1]];
            pos = [evt.screenX, evt.screenY];
            var r = elem.getBoundingClientRect();
            var left = elem.style.left !== '' ? parseInt(elem.style.left) : (cr.left + cr.right) / 2;
            var top = elem.style.top !== '' ? parseInt(elem.style.top) : (cr.top + cr.bottom) / 2;
            elem.style.left = (left + rel[0]) + 'px';
            elem.style.top = (top + rel[1]) + 'px';
        }
        
        mousecaptorElem.addEventListener('mousemove', mousemove);
        mousecaptorElem.addEventListener('mouseup', function(evt){
            // Stop dragging a window
            elem = null;
            this.removeEventListener('mousemove', mousemove);
            this.style.display = 'none';
        });
    }

    /// An array of window elements which holds order of z indices.
    var windowOrder = [];

    var inventoryDragStart = null;

    var inventoryTitleElem = document.getElementById('inventory2Title');

    placeCenter(inventoryElem);
    windowOrder.push(inventoryElem);

    inventoryTitleElem.addEventListener('mousedown', function(evt){
        dragWindowMouseDown(evt, inventoryElem, inventoryDragStart);
    });

    /// Bring a window to the top on the other windows.
    function bringToTop(elem){
        var oldIdx = windowOrder.indexOf(elem);
        if(0 <= oldIdx && oldIdx < windowOrder.length - 1){
            windowOrder.splice(oldIdx, 1);
            windowOrder.push(elem);
            for(var i = 0; i < windowOrder.length; i++)
                windowOrder[i].style.zIndex = i + windowZIndex;
        }
        var mousecaptorElem = document.getElementById('mousecaptor');
        mousecaptorElem.style.zIndex = i + windowZIndex; // The mouse capture element comes on top of all other windows
    }

    function showInventory(c, r){
        var inventoryContent = document.getElementById('inventory2Content');
        if(inventoryElem.style.display !== "none"){
            inventoryElem.style.display = "none";
            return;
        }
        // else if(tile.structure && tile.structure.inventory){
        else{
            inventoryElem.style.display = "block";
            bringToTop(inventoryElem);
            inventoryTarget = [c, r];
            // var recipeSelectButtonElem = document.getElementById('recipeSelectButton');
            // recipeSelectButtonElem.style.display = !inventoryTarget.recipes ? "none" : "block";
            // toolTip.style.display = "none"; // Hide the tool tip for "Click to oepn inventory"
            updateInventoryInt(inventoryContent, sim, false, sim.get_structure_inventory(c, r));
        }
        // else{
        //     inventoryContent.innerHTML = "";
        // }
    }

    // Place a window element at the center of the container, assumes the windows have margin set in the middle.
    function placeCenter(elem){
        var containerElem = document.getElementById('container2');
        var cr = containerElem.getBoundingClientRect();
        elem.style.left = ((cr.left + cr.right) / 2) + 'px';
        elem.style.top = ((cr.top + cr.bottom) / 2) + 'px';
    }

    placeCenter(inventoryElem);
    windowOrder.push(inventoryElem);

    const playerElem = document.createElement('div');
    playerElem.style.overflow = 'visible';
    playerElem.style.borderStyle = 'solid';
    playerElem.style.borderWidth = '1px';
    playerElem.style.border = '1px solid #00f';
    playerElem.style.backgroundColor = '#ffff7f';
    playerElem.style.position = 'relative';
    playerElem.style.margin = '3px';
    playerElem.style.left = '50%';
    playerElem.style.width = (320) + 'px';
    playerElem.style.height = (160) + 'px';
    container.appendChild(playerElem);
    playerElem.style.marginLeft = (-(playerElem.getBoundingClientRect().width + miniMapSize + tableMargin) / 2) + 'px';

    const playerInventoryElem = document.createElement('div');
    playerInventoryElem.style.position = 'relative';
    playerInventoryElem.style.overflowY = 'scroll';
    playerInventoryElem.style.width = '100%';
    playerInventoryElem.style.height = '100%';
    playerInventoryElem.style.textAlign = 'left';
    playerElem.appendChild(playerInventoryElem);

    canvas.addEventListener("mousedown", function(evt){
        const result = sim.mouse_down([evt.offsetX, evt.offsetY], evt.button);
        if(result !== null){
            const [command, x, y] = result;
            if(command === "showInventory"){
                showInventory(x, y);
            }
        }
        updateToolBar();
        evt.stopPropagation();
        evt.preventDefault();
        return false;
    });
    canvas.addEventListener("contextmenu", function(evt){
        evt.preventDefault();
    });
    canvas.addEventListener("mousemove", function(evt){
        sim.mouse_move([evt.offsetX, evt.offsetY]);
    });

    canvas.addEventListener("mouseleave", function(evt){
        sim.mouse_leave([evt.offsetX, evt.offsetY]);
    });

    function onKeyDown(event){
        if(sim.on_key_down(event.keyCode))
            updateToolBarImage();
    }
    window.addEventListener( 'keydown', onKeyDown, false );

    updateToolBar();

    updateInventory(sim.get_player_inventory());

    window.setInterval(function(){
        let events = sim.simulate(0.05);
        for(let event of events){
            if(event[0] === "updateStructureInventory"){
                console.log("updateStructureInventory event received");
                updateStructureInventory(event[1], event[2]);
            }
        }
        let result = sim.render(ctx);
        // console.log(result);
    }, 50);
    // simulate()
}
