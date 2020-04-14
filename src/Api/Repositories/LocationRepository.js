import Client from '../Client';
const resource = '/location/';

export default {
    get(path) {
        return Client.get(`${resource}${path}`);
    },
    getPost(cityName) {
        var path=resource+'towns/'
        return Client.get(`${path}${cityName}`);
    },
    // MANY OTHER ENDPOINT RELATED STUFFS
};