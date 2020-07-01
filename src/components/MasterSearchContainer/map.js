import { Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import InfoWindowEx from './InfoWindowEx'
import React, { Component } from 'react'
import { connect } from 'react-redux'
const mapStyles = {
  width: '100%',
  height: '100%',
};
const config = require('../../config.json')
export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores:  [
        {
          name: "Sydney",
          title: "Sydney",
          lat: -33.847927,
          lng: 150.6517938,
          id: 1,
          price:221,
          url:"https://www.google.com/maps/@36.999723390503455,36.999723390503455,17z/data=!10m1!1e1!12b1?source=apiv3&rapsrc=apiv3"
        },
        {
          name: "Melbourne",
          title: "Melbourne",
          lat: -37.9722342,
          lng: 144.7729561,
          id: 2,
          price:226,
          url:"https://www.google.com/maps/@36.999723390503455,36.999723390503455,17z/data=!10m1!1e1!12b1?source=apiv3&rapsrc=apiv3"
        },
        {
          name: "Perth",
          title: "Perth",
          lat: -31.9546904,
          lng: 115.8350292,
          id: 3,
          price:224,
          url:"https://www.google.com/maps/@37.032597539707,37.032597539707,17z/data=!10m1!1e1!12b1?source=apiv3&rapsrc=apiv3"
        }
      ],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    }
  }
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props.place_,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };
  showDetails = place => {
    console.log(place);
  };
  

  render() {
    var image = {
      url: 'http://www.homedepot.com/catalog/swatchImages/35/04/04a604de-8b52-4cd8-a394-6286f00b438d_35.jpg',
     
    };
    return (
        <Map
          google={this.props.google}
          zoom={4}
          style={mapStyles}
          initialCenter={{ lat: -24.9923319, lng: 135.2252427 }}
        >
          <Marker
          
          url={"https://www.google.com/maps/search/?api=1&query=36.26577,-92.54324"}
          
          />
            {/* {this.state.stores.map((place, i) => {
            return (
              <Marker
                onClick={this.onMarkerClick}
                key={place.id}
                title={place.name}
                icon={image}
                label= {{ text: `${place.price}`,
                color: 'white',
                fontSize: '15px',
                fontWeight: 'bold'}
                }
                place_={place}
               position={{ lat: place.lat, lng: place.lng }}
              />
            );
          })} */}
             <InfoWindowEx
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <h3>{this.state.selectedPlace.name}</h3>
              <button
                type="button"
                onClick={this.showDetails.bind(this, this.state.selectedPlace)}
              >
                Show details
              </button>
            </div>
          </InfoWindowEx>
          {/* {this.displayMarkers()} */}
        </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: config.Google.apiKey
})(MapContainer)