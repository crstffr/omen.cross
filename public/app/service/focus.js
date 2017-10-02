import Register from '../registry';
import Radio from './radio';

function Focus (name, id, delay = 10) {
    id = id ? ':' + id : '';
    setTimeout(() => {
        Radio.trigger('focusOn:' + name + id);
    }, delay);
}

Register.value('Focus', Focus);
export default Focus;