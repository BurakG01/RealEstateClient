import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
  render() {
    return (
      <Map google={this.props.google} zoom={14}>

      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCMKL0cff-7DDBGNkYdwhBPboMLwrRmi_s")
})(MapContainer)