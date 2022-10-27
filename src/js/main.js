let menu = createAndRenderMenu();
let dirDiv = createDirectionDiv(menu);
let actionDiv =createActionDiv(menu);
let bankDiv = createBankDiv(menu);
let deleteDiv = createDeleteDiv(menu);

function createAndRenderMenu(){
    let menu = document.createElement('div');
    let style = menu.style;
    menu.id = 'dofus-maps-menu';

    document.querySelector('body').appendChild(menu)

    return menu;
}


function createDirectionDiv(menu){
    let directionDiv = document.createElement('div');
    
    directionDiv.id = "dofus-maps-directions";
    directionDiv.classList.add('dofus-maps-menu-child');

    menu.appendChild(directionDiv);

    return directionDiv;
}

function createActionDiv(menu){
    let actionDiv = document.createElement('div');

    actionDiv.id = "dofus-maps-actions";
    actionDiv.classList.add('dofus-maps-menu-child');

    menu.appendChild(actionDiv);

    return actionDiv;
}

function createBankDiv(menu){
    let bankDiv = document.createElement('div');
    
    actionDiv.id = "dofus-maps-bank";
    bankDiv.classList.add('dofus-maps-menu-child');

    menu.appendChild(bankDiv)

    return bankDiv;
}

function createDeleteDiv(menu){
    let deleteDiv = document.createElement('div');
    
    deleteDiv.id = "dofus-maps-delete";
    deleteDiv.classList.add('dofus-maps-menu-child');

    menu.appendChild(deleteDiv);

    return deleteDiv;
}