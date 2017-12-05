export default function(state = 'SHOW_ALL', action) {
    switch(action.type) {
        case 'SHOW_ALL':
            return 'SHOW_ALL';
            break;
        case 'SHOW_ACTIVE':
            return 'SHOW_ACTIVE';
            break;
        case 'SHOW_COMPLETED':
            return 'SHOW_COMPLETED';
            break;
        default:
            return state;
    }
}