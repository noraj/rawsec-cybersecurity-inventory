import {root} from './root';

/**
 * Cookie utilities
 */

const doc = root.document;

export default {

    /**
     * Write a cookie
     * @param {String} name Name of the cookie
     * @param {String} value Value of the cookie
     * @param {Number} hours Cookie duration in hours
     */
    write(name, value, hours) {
        let expire = '';
        if (hours) {
            expire = new Date((new Date()).getTime() + hours * 3600000);
            expire = '; expires=' + expire.toGMTString();
        }
        doc.cookie = name + '=' + escape(value) + expire;
    },

    /**
     * Read a cookie
     * @param {String} name Name of the cookie
     * @returns {String} Value of the cookie
     */
    read(name) {
        let cookieValue = '',
            search = name + '=';
        if (doc.cookie.length > 0) {
            let cookie = doc.cookie,
                offset = cookie.indexOf(search);
            if (offset !== -1) {
                offset += search.length;
                let end = cookie.indexOf(';', offset);
                if (end === -1) {
                    end = cookie.length;
                }
                cookieValue = unescape(cookie.substring(offset, end));
            }
        }
        return cookieValue;
    },

    /**
     * Remove a cookie
     * @param {String} name Name of the cookie
     */
    remove(name) {
        this.write(name, '', -1);
    }

};
