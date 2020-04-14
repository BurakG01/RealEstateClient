import Client from '../Client';
const resource = '/listing/';

export default {
    get(path) {
        return Client.get(`${resource}${path}`);
    },
    getPost(body) {
        return Client.post(`${resource}filterable`,body);
    },
    // MANY OTHER ENDPOINT RELATED STUFFS
};