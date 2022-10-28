/**
 * #mapCoordinates => tooltips avec les coordonnées, calcul les coordonnées à partir de la position souris
 * #mapCoordinates .coord => donne les coordonnées actuel où la souris se trouve
 * #mapInfo #mapInfo-title
 */
let map;
initParameters();
console.log('loulo')
let menu = createAndRenderMenu();
let dirDiv = createDirectionDiv(menu);
let actionDiv =createActionDiv(menu);
let bankDiv = createBankDiv(menu);
let deleteDiv = createDeleteDiv(menu);

function createAndRenderMenu(){
    let menu = document.createElement('div');
    menu.id = 'dofus-maps-menu';

    document.querySelector('body').appendChild(menu)

    return menu;
}

function separator(){
    let hr = document.createElement('hr');
    hr.classList.add('dofus-maps-separator');

    return hr;
}

function div(id, classes, ...childs){
    let div = document.createElement('div');
    div.id = id;
    classes = classes?.split(',');
    if(classes)
        div.classList.add(...classes);

    if(childs)
        div.append(...childs);

    return div;
}


function createDirectionDiv(menu){
    //let directionDiv = document.createElement('div');
    let directionTitle = document.createElement('span');
    let [arrowRight, arrowLeft, arrowTop, arrowBot] = [
        document.createElement('span'),
        document.createElement('span'),
        document.createElement('span'),
        document.createElement('span')
    ];
    
    arrowRight.id = 'dofus-maps-dir-right';
    arrowRight.title = 'Droite';
    arrowRight.classList.add('dofus-maps-menu-item', 'btn');
    arrowRight.innerHTML = '<i class="fa-solid fa-arrow-right fa-xl"></i>';
    arrowLeft.id ='dofus-maps-dir-left';
    arrowLeft.title = 'Gauche';
    arrowLeft.classList.add('dofus-maps-menu-item', 'btn');
    arrowLeft.innerHTML = '<i class="fa-solid fa-arrow-left fa-xl"></i>';
    arrowBot.id = 'dofus-maps-dir-bot';
    arrowBot.title = 'Bas';
    arrowBot.classList.add('dofus-maps-menu-item', 'btn');
    arrowBot.innerHTML = '<i class="fa-solid fa-arrow-down fa-xl"></i>';
    arrowTop.id = 'dofus-maps-dir-top';
    arrowTop.title = 'Haut';
    arrowTop.classList.add('dofus-maps-menu-item', 'btn');
    arrowTop.innerHTML = '<i class="fa-solid fa-arrow-up fa-xl"></i>';

    directionTitle.title = 'Direction à prendre'
    directionTitle.classList.add('dofus-maps-section-title')
    directionTitle.innerHTML = 'Directions';

    let items = div('', 'dofus-maps-menu-group', arrowLeft, arrowTop, arrowBot, arrowRight);
    let directionDiv = div('dofus-maps-directions','dofus-maps-menu-child', directionTitle, items);
    menu.append(directionDiv, separator());

    return directionDiv;
}

function createActionDiv(menu){
    let actionTitle = document.createElement('span');
    let [fight, harvest, bank] = [
        document.createElement('span'),
        document.createElement('span'),
        document.createElement('span')
    ];

    fight.id = 'dofus-maps-action-fight';
    fight.title = 'Combat';
    fight.classList.add('dofus-maps-menu-item', 'btn', 'text-danger');
    fight.innerHTML = '<i class="fa-solid fa-person-rifle fa-2xl"></i>';
    harvest.id = 'dofus-maps-action-harvest';
    harvest.title = 'Récolte';
    harvest.classList.add('dofus-maps-menu-item', 'btn', 'text-success');
    harvest.innerHTML = '<i class="fa-solid fa-person-digging fa-2xl"></i>';
    bank.id = 'dofus-maps-action-bank';
    bank.title = 'Banque';
    bank.classList.add('dofus-maps-menu-item', 'btn', 'text-warning');
    bank.innerHTML = '<i class="fa-solid fa-building-columns fa-2xl"></i>';

    actionTitle.title = 'Action pour les routes';
    actionTitle.classList.add('dofus-maps-section-title')
    actionTitle.innerHTML = 'Actions'

    let items = div('', 'dofus-maps-menu-group', fight, harvest, bank)
    let actionDiv = div('dofus-maps-actions','dofus-maps-menu-child',actionTitle, items);
    menu.append(actionDiv, separator());

    return actionDiv;
}

function createBankDiv(menu){
    let bankBtn = document.createElement('button');
    bankBtn.classList.add('btn', 'btn-warning', 'text-light', 'py-3')
    bankBtn.type = 'button';
    bankBtn.innerHTML = '<i class="fa-solid fa-building-columns fa-2xl p-2"></i> Placer la banque'
    let bankDiv = div('dofus-maps-bank','dofus-maps-menu-child', bankBtn);
    menu.append(bankDiv, separator());

    return bankDiv;
}

function createDeleteDiv(menu){
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-danger', 'text-light', 'py-3')
    deleteBtn.type = 'button';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can fa-2xl p-2"></i> Effacer position'

    let deleteDiv = div('dofus-maps-delete', 'dofus-maps-menu-child', deleteBtn)
    menu.appendChild(deleteDiv);

    return deleteDiv;
}

function initParameters(){
    console.log('loulou', window)
    let head = document.querySelector('head');
    head.insertAdjacentElement('afterbegin', cssLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'));
    head.insertAdjacentElement('beforeend', injectJS(chrome.runtime.getURL('src/js/main.js')));
    console.log(map)
    //head.insertAdjacentElement('afterbegin',cssLink('https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css'));
    //head.insertAdjacentElement('beforeend',cssLink(chrome.runtime.getURL('src/css/main.css')));
}

function cssLink(link){
    let cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = link
    
    return cssLink;
}

function injectJS(link){
    let jsLink = document.createElement('script');
    jsLink.type = 'text/javascript';
    jsLink.href = link
    
    return jsLink;
}