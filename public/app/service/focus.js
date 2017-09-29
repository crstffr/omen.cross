import Register from '../registry';
import Radio from './radio';

function Focus (eventName, delay = 10) {
    setTimeout(() => {
        Radio.trigger('focusOn:' + eventName);
    }, delay);
}

Register.value('Focus', Focus);
export default Focus;