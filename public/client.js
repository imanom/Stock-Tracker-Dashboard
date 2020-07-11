const $events = document.getElementById('events');

const newItem = (content) => {
    const item = document.createElement('li');
    item.innerText = content;
    return item;
};

const socket = io();

socket.on('changeData', (value) => {
    
    var table = document.getElementById("tableID"); 
    var totalRows = document.getElementById("tableID").rows.length;
    var totalCol = 5;

    for(let i=0;i<totalRows;i++){
        let objCells = (table.rows[i].cells[0].innerHTML).toString(); 
        if(objCells==value.instrument){
            table.rows[i].cells[2].innerHTML = value.current_val
            table.rows[i].cells[3].innerHTML = value.ltp
            table.rows[i].cells[4].innerHTML = value.change.daily_change
            table.rows[i].cells[4].style.color= (value.change.daily_change.includes('+')) ? 'green' : 'red';
            if(value.ltp==value.base_value){
                table.rows[i].cells[4].style.color='black';
            }
        }
    }

});
