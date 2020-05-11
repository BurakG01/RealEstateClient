import ListingnRepository from './Repositories/ListingRepository';
import LocationRepository from './Repositories/LocationRepository';
const repositories = {
    'listings': ListingnRepository,
    'locations':LocationRepository
}
export default {
    get: name => repositories[name]
};