class Modal {
    
    render(document){
        let modal = document.createElement('div');
        modal.id = 'dofus-maps-menu';
        modal.style.position = "absolute";
        modal.style.zIndex = 99999;
        modal.style.left = '-5px';
        modal.style.bottom = '-5px';
        modal.style.display = "block";
        modal.style.height = "15%";
        modal.style.width = "30%";
        modal.style.backgroundColor = "white";

        document.querySelector('body').appendChild(modal)
    }
}

export {Modal};