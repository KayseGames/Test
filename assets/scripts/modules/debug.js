import { ms } from '../main.js';


export class Debug {
    constructor(html, divId = 'debug') {
        this.html = html;
        this.active = false;
        this.$ = {};
        this.toggle = () => {};
        this.isUpdating = false;
        this.update = function (html) {
            if (this.isUpdating) return;
            this.isUpdating = true;
            this.$.html(html);
            setTimeout(() => this.isUpdating = false, 100);
        }
        this.init = function () {
            try {
                // remove any existing debug elements
                $(`#${divId}`).remove();
                // append the debug element to the body
                $('body').append(this.html);
                // cache the debug element
                this.$ = $(`#${divId}`);
                this.$.hide();
                // create a toggle function to show/hide the debug elements
                this.toggle = function() {
                    this.active = !this.active;
                    this.active ? this.$.show() : this.$.hide();
                }
                // bind the debug toggle to the ` key
                $(document).on('keydown', (e) => (e.key === '`') && this.toggle());
            } catch (error) {
                console.log('Error in Debug.init()');
                console.error(error);
            }
        };
        this.init();
    }
};
