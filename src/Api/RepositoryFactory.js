import ListingnRepository from './Repositories/ListingRepository';
import LocationRepository from './Repositories/LocationRepository';
const repositories = {
    'listings': ListingnRepository,
    'location':LocationRepository
}
export default {
    get: name => repositories[name]
};