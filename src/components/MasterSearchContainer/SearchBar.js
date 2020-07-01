import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadProperties, filterProperties } from "../../redux/actions";
import { Query } from '@syncfusion/ej2-data';
import RepositoryFactory from '../../Api/RepositoryFactory'
import { enableRipple } from '@syncfusion/ej2-base';
import Listings from './Listings.js'
import GoogleMapReact from 'google-map-react';
import MapContainer from './map'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { ButtonComponent, ChipDirective, ChipListComponent, ChipsDirective } from '@syncfusion/ej2-react-buttons';
import {
  MultiSelectComponent,
  CheckBoxSelection,
  Inject, DropDownListComponent
} from '@syncfusion/ej2-react-dropdowns';
import Pagination from '../../components/Pagination'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
const AnyReactComponent = ({ text }) => <div className="marker" >{text}</div>;
enableRipple(true);
class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      totalCount:0,
      filter: {},
      listings: [],
      properties: [],
      selectedRooms: [],
      furnitureType: '',
      city: '',
      keyword: '',
      towns: [],
      counties: [],
      cities: [
        { Name: 'Adana', Code: 'ada' },
        { Name: 'Adıyaman', Code: 'DK' },
        { Name: 'Afyon', Code: 'DK' },
        { Name: 'Ağrı', Code: 'DK' },
        { Name: 'Amasya', Code: 'DK' },
        { Name: 'Ankara', Code: 'DK' },
        { Name: 'Antalya', Code: 'DK' },
        { Name: 'Artvin', Code: 'DK' },
        { Name: 'Balıkesir', Code: 'hat' },
        { Name: 'Bilecik', Code: 'CM' },
        { Name: 'Bingöl', Code: 'DK' }
      ],
      ownerType: '',
      homeType: '',
      rooms: [
        { Name: '3+1', Code: '1' },
        { Name: '2+1', Code: '2' },
        { Name: '4+1', Code: '3' },
        { Name: '1+1', Code: '4' }],

      streets: [],
      streetList: [],
      countiesCode: [],
      deneme: ['sdsd']
    }
    this.locationRepository = RepositoryFactory.get("locations");
    this.listingRepository = RepositoryFactory.get("listings");

    this.checkFields = { text: 'Name', value: 'Code' };
    this.countyFields = { text: 'name', value: 'code' };
    this.checkStreetFields = { groupBy: 'district', text: 'name', value: 'id' };

    this.onFiltering = (e) => {
      let query = new Query();
      query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
      e.updateData(this.state.counties, query);
    };
  }

  componentWillMount = () => {
    const params = new URLSearchParams(this.props.location.search)
    let filter = {
      city: params.get('city'),
      towns: params.get('town') ? [params.get('town')] : null,
    }
    this.setState({
      city:  params.get('city'),
      towns:params.get('town') ? [params.get('town')] : []
    });

    this.getListings(filter);
  }


  getListings = filter => {
   
    this.listingRepository.getPost(filter).then((res) => {
      console.log(res.data.listings)
      let listings = [];
      res.data.listings.forEach(listing => {
       
        listings.push({

          owners: listing.owners,
          ownerSite: listing.listing.ownerSite,
          advertStatus: listing.listing.advertStatus,
          advertOwnerType:listing.listing.advertOwnerType=='RealEstateAgent'?'Emlakçı':'Sahibinden',
          address: listing.listing.street,
          price: listing.listing.price,
          city: listing.listing.city,
          state: listing.listing.town,
          rooms: listing.listing.roomNumber,
          image: listing.listing.coverImage,
          furnitureStatus: listing.listing.furnitureStatus=='Belirtilmemiş' ? '?' :listing.listing.furnitureStatus 
         
        });
      });
      
      this.setState({ listings: listings ,totalCount:res.data.totalCount, loading:false })


    }).catch((err) => {
      console.log("err", err);
    })
  }
  SelectedCity = args => {
    this.locationRepository.getPost(args.itemData.Name).then((response) => {
      this.setState({ counties: response.data })
    })
    this.setState({
      city: args.itemData.Name
    });
  }

  countiesSelection = event => {

    let countiesCode = this.state.countiesCode;
    let towns = this.state.towns;
    var code = event.itemData.code;
    var name = event.itemData.name
   
    if (event.name === "removing") {
      var nameIndex = towns.indexOf(name)
      var codeIndex = towns.indexOf(code)
      towns.splice(nameIndex, 1);
      countiesCode.splice(codeIndex, 1)
    } else {
      towns.push(name);
      countiesCode.push(code);
    }
    if(towns.length==0){
      this.setState({streetList:[]})
    }

    this.locationRepository.getPostNeighborhoods({ towns: this.state.countiesCode }).then((response) => {
      this.setState({ streets: response.data })
    })
  }
  roomsSelection = event => {
    let selectedRooms = this.state.selectedRooms;
    var value = event.itemData.Name;

    if (event.name === "removing") {
      var index = selectedRooms.indexOf(value)
      selectedRooms.splice(index, 1);
    } else {
      selectedRooms.push(value);
    }

  }
  streetSelection = event => {

    let streetList = this.state.streetList;
    var value = event.itemData.id;
    if (event.name === "removing") {
      var index = streetList.indexOf(value)
      streetList.splice(index, 1);
    } else {
      streetList.push(value);
    }
  }
  onPageChanged = data => {
  
    let { city, towns, selectedRooms, ownerType, homeType, furnitureType, keyword, streetList } = this.state;

    let filter = {
      city: city,
      towns: towns,
      roomNumber: selectedRooms,
      advertOwnerType: ownerType,
      advertStatus: homeType,
      furnitureType: furnitureType,
      query: keyword,
      streets: streetList,
      pageNumber:data.currentPage-1
    }
  
    this.getListings(filter);
   
  }
  search = () => {

    let { city, towns, selectedRooms, ownerType, homeType, furnitureType, keyword, streetList } = this.state;

    let filter = {
      city: city,
      towns: towns,
      roomNumber: selectedRooms,
      advertOwnerType: ownerType,
      advertStatus: homeType,
      furnitureType: furnitureType,
      query: keyword,
      streets: streetList
    }
  
    this.setState({ loading: true })
    this.getListings(filter)
  }
  AdvertType = event => {
    this.setState({
      homeType: event.selected ? event.data.value : '',
    });

  }
  onChangeStrees = event => {
    this.setState({
      streetList: event.value,
    });
  }
  AdvertOwnerType = event => {
    this.setState({
      ownerType: event.selected ? event.data.value : '',
    });
  }
  FurnitureType = event => {
    this.setState({
      furnitureType: event.selected ? event.data.value : '',
    });
  }
  keyword = (event) => {
    this.setState({
      keyword: event.value,
    });
  }
  render() {
  
   var totalCount=this.state.totalCount;
   var loading=this.state.loading
 

       return (
      <div className="row">

        <div className="col-3" style={{ height: "max-content" }}  >
          <div className="container">
            <section id="filtersection">
              <section>
                <div className='control-pane'>
                  <div className='control-section col-lg-8'>
                    <div id='filtering' className="control-styles">
                      <DropDownListComponent
                        id="country" ref={(dropdownlist) => { this.listObj = dropdownlist; }}
                        dataSource={this.state.cities} filtering={this.onFiltering.bind(this)}
                        select={this.SelectedCity}
                        noRecordsTemplate={"Eşleşme Bulunamadı"}
                        filterBarPlaceholder='Şehir' allowFiltering={true} fields={this.checkFields}
                        placeholder="Şehir " popupHeight="220px" />
                    </div>
                  </div>
                </div>
              </section>
              <br></br>
              <section>
                <div id="multichecbox" className='control-pane'>
                  <div className='control-section col-lg-8'>
                    <div id="multigroup" className="control-styles">
                      <MultiSelectComponent id="checkbox"
                        ref={(scope) => { this.mulObj1 = scope; }}
                        dataSource={this.state.counties}
                        fields={this.countyFields}
                        placeholder="İlçe " mode="CheckBox"
                        showSelectAll={true}
                        selectAllText={"Hepsi"}
                        unSelectAllText={"Hiçbiri"}
                        showDropDownIcon={true}
                        select={this.countiesSelection.bind(this)}
                        removing={this.countiesSelection.bind(this)}
                        noRecordsTemplate={"Eşleşme Bulunamadı"}
                        filterBarPlaceholder="İlçe " popupHeight="350px">
                        <Inject services={[CheckBoxSelection]} />
                      </MultiSelectComponent>
                    </div>
                  </div>
                </div>
              </section>
              <br></br>
              <section>
                <div id="multichecbox" className='control-pane'>
                  <div className='control-section col-lg-8'>
                    <div id="multigroup" className="control-styles">
                      <MultiSelectComponent id="checkbox" ref={(scope) => { this.mulObj4 = scope; }}
                        dataSource={this.state.streets}
                        fields={this.checkStreetFields}
                        enableGroupCheckBox={true}
                        removing={this.streetSelection.bind(this)}
                        select={this.streetSelection.bind(this)}
                        placeholder="Mahalle "
                        selectAllText={"Hepsi"}
                        unSelectAllText={"Hiçbiri"}
                        noRecordsTemplate={"Eşleşme Bulunamadı"}
                        mode="CheckBox" showSelectAll={true}
                        showDropDownIcon={true} filterBarPlaceholder="Mahalle " popupHeight="350px">
                        <Inject services={[CheckBoxSelection]} />
                      </MultiSelectComponent>
                    </div>
                  </div>
                </div>
              </section>
              <br></br>
              <section>
                <div id="multichecbox" className='control-pane'>
                  <div className='control-section col-lg-8'>
                    <div id="multigroup" className="control-styles">
                      <MultiSelectComponent id="checkbox" ref={(scope) => { this.mulObj3 = scope; }}
                        dataSource={this.state.rooms}
                        fields={this.checkFields}
                        showDropDownIcon={true}
                        removing={this.roomsSelection.bind(this)}
                        select={this.roomsSelection.bind(this)}
                        placeholder="Oda Sayısı"
                        selectAllText={"Hepsi"}
                        unSelectAllText={"Hiçbiri"}
                        mode="CheckBox"
                        showSelectAll={true}
                        allowFiltering={false}
                        showDropDownIcon={true} popupHeight="350px">
                        <Inject services={[CheckBoxSelection]} />
                      </MultiSelectComponent>
                    </div>
                  </div>
                </div>
              </section>
              <br></br>
              <br></br>
              <section>
                <div id="multichecbox" className='control-pane'>
                  <div className='control-section col-lg-8'>
                    <div id="multigroup" className="control-styles">
                      <TextBoxComponent input={this.keyword.bind(this)}
                        placeholder="Kelime ile Ara" cssClass="e-outline" floatLabelType="Auto" />
                    </div>
                  </div>
                </div>
              </section>
              <br></br>
              <br></br>
              <section>
                <div className="d-flex justify-content-center">
                  <ChipListComponent click={this.AdvertType.bind(this)} id="chip-choice" selection="Single" cssClass="e-outline">
                    <ChipsDirective  >
                      <ChipDirective text="Hepsi" value=""></ChipDirective>
                      <ChipDirective text="Kiralık" value="Kiralık" ></ChipDirective>
                      <ChipDirective text="Satılık" value="Satılık"></ChipDirective>
                    </ChipsDirective>
                  </ChipListComponent>
                </div>
              </section>
              <br></br>
              <section>
                <div className="d-flex justify-content-center">
                  <ChipListComponent click={this.AdvertOwnerType.bind(this)} id="chip-choice" selection="Single" cssClass="e-outline">
                    <ChipsDirective  >
                      <ChipDirective text="Hepsi" value=""></ChipDirective>
                      <ChipDirective text="Sahibinden" value="Personal" ></ChipDirective>
                      <ChipDirective text="Emlakçıdan" value="RealEstateAgent"></ChipDirective>
                    </ChipsDirective>
                  </ChipListComponent>
                </div>
              </section>
              <br></br>
              <section>
                <div className="d-flex justify-content-center">
                  <ChipListComponent click={this.FurnitureType.bind(this)} id="chip-choice" selection="Single" cssClass="e-outline">
                    <ChipsDirective  >
                      <ChipDirective text="Hepsi" value=""></ChipDirective>
                      <ChipDirective text="Eşyalı" value="Eşyalı" ></ChipDirective>
                      <ChipDirective text="Eşyasız" value="Boş"></ChipDirective>
                    </ChipsDirective>
                  </ChipListComponent>
                </div>
              </section>
              <section>
                <div id="multichecbox" className='control-pane'>
                  <div className='control-section col-lg-8'>
                    <div id="multigroup" className="control-styles">
                      <ButtonComponent onClick={this.search} cssClass='e-custom' id="btn">Ara</ButtonComponent>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </div>
        
        </div>
        <div className="col-9">

        {loading ? (
          
          <div className="d-flex justify-content-center" style={{marginTop :"150px"}}><Loader
          type="Grid"
          color="#6610f2"
          height={100}
          width={100}
       
  
       /></div>
         
      ) : (
        <div style={{ height: 'max-content', width: '100%' }}>
        <Listings ListingsData={this.state.listings} />
      
        <section id='pagination'>
      <div className='row'>
        
        <div className="d-flex flex-row py-4 align-items-center">
          <Pagination totalRecords={totalCount} pageLimit={20} pageNeighbours={2} onPageChanged={this.onPageChanged} />
        </div>
      </div>
    </section>
        {/* <GoogleMapReact
      bootstrapURLKeys={{ key:"AIzaSyCMKL0cff-7DDBGNkYdwhBPboMLwrRmi_s" }}
      defaultCenter={ {
        lat: 39.925533,
        lng: 32.866287
      }}
      defaultZoom={6}
      
    >
         <AnyReactComponent
        lat={40.94886894055946}
        lng={40.94886894055946}
        text="My Marker"
      />
    </GoogleMapReact> */}
      </div>
      )}


        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  properties: state.properties,
})


export default connect(mapStateToProps, { loadProperties, filterProperties })(SearchBar);