async function get_monogram(throw_button_id) {
    num = Math.floor(Math.random() * 4);
    button_element = document.getElementById(throw_button_id);
    count = Number(button_element.attributes["count"].value);
    if (count == 6) {
        return;
    }

    monogram_item_elem = document.getElementsByClassName("monogram-item")[5-count];
    monogram_elem = monogram_item_elem.getElementsByClassName("monogram")[0];
    monogram_desc_elem = monogram_item_elem.getElementsByClassName("monogram-description")[0];
    if (num % 2 == 0) {
        monogram_elem.innerHTML = "⚋";
        if (num == 0) {
            monogram_desc_elem.innerHTML = "Old Yin";
        }
        else {
            monogram_desc_elem.innerHTML = "Young Yin";
        }
    }
    else { 
        monogram_elem.innerHTML = "⚊";
        if (num == 1) {
            monogram_desc_elem.innerHTML = "Young Yang";
        }
        else {
            monogram_desc_elem.innerHTML = "Old Yang";
        }
    }
    monogram_item_elem.classList.add("visible");

    count++;
    button_element.attributes["count"].value = String(count);
    monogram_elem.attributes["throw"].value = String(num);

    if (count == 6) {
        button_elem = document.getElementById("throw");
        button_elem.style.visibility = "hidden";
        await sleep(1000);

        get_hexagrams();
    }
}

function get_hexagrams() {
    primary_hexagram = get_hexagram_stack_from_monograms();
    primary_hexagram_number = convert_hexagram_stack_to_number(primary_hexagram);

    secondary_hexagram = get_secondary_hexagram_from_stack(primary_hexagram);
    secondary_hexagram_number = null;
    if (secondary_hexagram) {
        secondary_hexagram_number = convert_hexagram_stack_to_number(secondary_hexagram);
    }

    show_hexagram_preview(primary_hexagram_number, secondary_hexagram_number);
}

function get_hexagram_stack_from_monograms() {
    monograms = document.getElementsByClassName("monogram");
    
    stack = [];
    for (let ii = 5; ii >=0; ii--) {
        stack.push(Number(monograms[ii].attributes["throw"].value));
    }
    return stack;
}

function get_secondary_hexagram_from_stack(primary_hexagram) {
    secondary_hexagram = [];
    has_secondary_hexagram = false;
    for (let ii = 0; ii < 6; ii++) {
        if (primary_hexagram[ii] == 0) {
            secondary_hexagram.push(1);
            has_secondary_hexagram = true;
        }
        else if (primary_hexagram[ii] == 3) {
            secondary_hexagram.push(2);
            has_secondary_hexagram = true;
        }
        else {
            secondary_hexagram.push(primary_hexagram[ii]);
        }
    }
    if (has_secondary_hexagram) {
        return secondary_hexagram;
    }
    return null;
}

const hexagram_map = [
    [2, 23, 8, 20, 16, 35, 45, 12],
    [15, 52, 39, 53, 62, 56, 31, 33],
    [7, 4, 29, 59, 40, 64, 47, 6],
    [46, 18, 48, 57, 32, 50, 28, 44],
    [24, 27, 3, 42, 51, 21, 17, 25],
    [36, 22, 63, 37, 55, 30, 49, 13],
    [19, 41, 60, 61, 54, 38, 58, 10],
    [11, 26, 5, 9, 34, 14, 43, 1]
];
function convert_hexagram_stack_to_number(hexagram) {
    trigram_lower = convert_trigram_to_integer(hexagram.slice(0, 3));
    trigram_upper = convert_trigram_to_integer(hexagram.slice(3));

    return hexagram_map[trigram_lower][trigram_upper];
}

function convert_trigram_to_integer(trigram) {
    integer = 0;
    for (let ii = 0; ii < 3; ii++) {
        if (trigram[ii] % 2 == 1) {
            integer += 1;
        }
        if (ii < 2) {
            integer *= 2;
        }
    }
    return integer;
}

async function show_hexagram_preview(primary_hexagram, secondary_hexagram) {
    monogram_item_elems = document.getElementsByClassName("monogram-item")
    for (let ii = 0; ii < monogram_item_elems.length; ii++) {
        monogram_item_elems[ii].classList.remove("visible");
    }
    await sleep(1500);
    document.getElementById("intro").style.display = "none";

    container_elem = document.getElementById("hexagram-preview");
    item_elems = container_elem.getElementsByClassName("fadable");

    primary_data = data["text"][String(primary_hexagram)];
    symbol_elem = item_elems[0].getElementsByClassName("symbol")[0];
    symbol_elem.innerHTML = primary_data["hexagram_unicode"];
    item_elems[0].attributes["onclick"].value = "show_hexagram_data("+primary_hexagram+")";
    
    name_elem = item_elems[0].getElementsByClassName("name")[0];
    name_elem.innerHTML = primary_data["number"] + ". " + primary_data["name"];
    item_elems[0].classList.add("visible");

    if (secondary_hexagram) {
        await sleep(2000);
        item_elems[1].classList.add("visible");
        await sleep(2000);

        secondary_data = data["text"][String(secondary_hexagram)];
        symbol_elem = item_elems[2].getElementsByClassName("symbol")[0];
        symbol_elem.innerHTML = secondary_data["hexagram_unicode"];
        item_elems[2].attributes["onclick"].value = "show_hexagram_data("+secondary_hexagram+")";
        
        name_elem = item_elems[2].getElementsByClassName("name")[0];
        name_elem.innerHTML = secondary_data["number"] + ". " + secondary_data["name"];
        item_elems[2].classList.add("visible");

        await sleep(2000);
        instruction_elem = document.getElementById("instruction");
        instruction_elem.classList.add("visible");
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }  

async function show_hexagram_data(hexagram_number) {
    hexagram_data = data["text"][String(hexagram_number)];
    hexagram_elem = document.getElementById("hexagram");
    if (hexagram_elem.classList.contains("visible")) {
        hexagram_elem.classList.remove("visible");
        await sleep(1000);
    }

    symbol_elem = hexagram_elem.getElementsByClassName("symbol")[0];
    symbol_elem.innerHTML = hexagram_data["hexagram_unicode"];
    
    name_elem = hexagram_elem.getElementsByClassName("name")[0];
    name_elem.innerHTML = hexagram_data["number"] + ". " + hexagram_data["name"];

    judgment_elem = hexagram_elem.getElementsByClassName("judgment")[0];
    judgment_elem.innerHTML = split_text(hexagram_data["presentation"]);

    trigram_elems = hexagram_elem.getElementsByClassName("trigram");
    show_trigram_data(trigram_elems[0], data["trigrams"][hexagram_data["trigram_above"]])
    show_trigram_data(trigram_elems[1], data["trigrams"][hexagram_data["trigram_below"]])

    image_elem = hexagram_elem.getElementsByClassName("image")[0];
    image_elem.innerHTML = split_text(hexagram_data["image"]);

    lines = hexagram_data["lines"];
    lines_elem = hexagram_elem.getElementsByClassName("lines")[0];
    clear_children(lines_elem);
    for (let ii = 0; ii < lines.length; ii++) {
        let index = document.createElement("p");
        index.innerHTML = `<b>${String(ii+1)}</b>`;
        lines_elem.appendChild(index);
        let child = document.createElement("p");

        child.innerHTML = split_text(lines[ii]);
        lines_elem.appendChild(child);
    }

    hexagram_elem.classList.add("visible");
}

function show_trigram_data(trigram_element, trigram_data) {
    figure_elem = trigram_element.getElementsByClassName("figure")[0];
    figure_elem.innerHTML = trigram_data["figure_unicode"];

    image_in_nature_elem = trigram_element.getElementsByClassName("image_and_attributes")[0]
    image_in_nature_elem.innerHTML = trigram_data["image_in_nature"] + " (" + trigram_data["attribute"] + ")";
}

function split_text(text) {
    return text.split("\n").join("<br/>");
}

function clear_children(element) {
    while(element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

function display_hexagram_table() {
    table_elem = document.getElementById("hexagram-table");
    rows = table_elem.getElementsByClassName("hexagram-row");

    for (let row_idx = 0; row_idx < rows.length; row_idx++) {
        cols = rows[row_idx].getElementsByClassName("hexagram-cell");

        for (let col_idx = 0; col_idx < cols.length; col_idx++) {
            hexagram_data = data["text"][hexagram_map[row_idx][col_idx]];

            symbol_elem = cols[col_idx].getElementsByClassName("symbol")[0];
            symbol_elem.innerHTML = hexagram_data["hexagram_unicode"];

            name_elem = cols[col_idx].getElementsByClassName("name")[0];
            name_elem.innerHTML = hexagram_data["number"] + ". " + hexagram_data["name"];

            cols[col_idx].attributes["onclick"].value = "display_hexagram_info("+hexagram_map[row_idx][col_idx]+")";
        }
    }
}

// TODO: DRY this up
function display_hexagram_info(hexagram_number) {
    hexagram_data = data["text"][String(hexagram_number)];
    hexagram_elem = document.getElementById("hexagram");
    
    symbol_elem = hexagram_elem.getElementsByClassName("symbol")[0];
    symbol_elem.innerHTML = hexagram_data["hexagram_unicode"];
    
    name_elem = hexagram_elem.getElementsByClassName("name")[0];
    name_elem.innerHTML = hexagram_data["number"] + ". " + hexagram_data["name"];

    judgment_elem = hexagram_elem.getElementsByClassName("judgment")[0];
    judgment_elem.innerHTML = split_text(hexagram_data["presentation"]);

    trigram_elems = hexagram_elem.getElementsByClassName("trigram");
    show_trigram_data(trigram_elems[0], data["trigrams"][hexagram_data["trigram_above"]])
    show_trigram_data(trigram_elems[1], data["trigrams"][hexagram_data["trigram_below"]])

    image_elem = hexagram_elem.getElementsByClassName("image")[0];
    image_elem.innerHTML = split_text(hexagram_data["image"]);

    lines = hexagram_data["lines"];
    lines_elem = hexagram_elem.getElementsByClassName("lines")[0];
    clear_children(lines_elem);
    for (let ii = 0; ii < lines.length; ii++) {
        let index = document.createElement("p");
        index.innerHTML = `<b>${String(ii+1)}</b>`;
        lines_elem.appendChild(index);
        let child = document.createElement("p");

        child.innerHTML = split_text(lines[ii]);
        lines_elem.appendChild(child);
    }
}