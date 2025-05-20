const modal_activities_control = document.getElementById("modal_add_control");
const modal_add_activities = document.getElementById("modal_add_environmental_activity");
let btn_cancel_add_activity = document.getElementById('btn_cancel_add_activity');
let btn_cancel_add_controll = document.getElementById("btn_cancel_add_controll");


function open_activities_control(){
    modal_activities_control.showModal();
}

btn_cancel_add_controll.addEventListener('click', () => {
    modal_activities_control.classList.add('closing');

    modal_activities_control.addEventListener('animationend', () => {
        modal_activities_control.classList.remove('closing');
        modal_activities_control.close();
    }, { once: true });
});

function open_add_activities(){
    modal_add_activities.showModal();
}

btn_cancel_add_activity.addEventListener('click', () => {
    modal_add_activities.classList.add('closing');

    modal_add_activities.addEventListener('animationend', () => {
        modal_add_activities.classList.remove('closing');
        modal_add_activities.close();
    }, { once: true });
});