import * as React from 'react';
import styles from './DeskBooking.module.scss';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import SPRequest from './SPRequest';
import AbmModal from './Modal/Modal';

interface IDeskBookingProps {
  description: string;
  context: WebPartContext;
  jobTitle: string;
  userDisplayName: string;
  Initials: string;
  ProfilePic: string;
}

interface floorplan {
  id: number;
  deskRef: string;
  jobTitle: string;
  userDisplayName: string;
  Initials: string;
  email: string;
  ProfilePic: string;
  userDesk: string;
 }

 interface desk {
   id: number;
   deskRef: string;
   startDate: Date;
   endDate: Date;
   profilePic: string;
   jobTitle: string;
   initials: string;
   userName: string;
 }
 

export default class DeskBooking extends React.Component<IDeskBookingProps, {
  deskItems: floorplan[]; 
  showModal: boolean;
  modalContent: {heading: any, body: JSX.Element},
  bookedDesks: desk[],
  deskAvailable: boolean;
  deskBooked: boolean;
  deskRef: string;
  profilePic: string;
  initials: string;
  userName: string;
  jobTitle:string;

}> {
  updateVal: (stateName: string, value: any) => void;


  constructor(props: IDeskBookingProps) {
    super(props);
    this.state = {
      deskItems: [],
      showModal: false,
      modalContent: {heading:<div></div>, body: <div></div>},
      bookedDesks: [],
      deskAvailable: false,
      deskBooked: false,
      deskRef: "",
      profilePic: "",
      initials: "",
      userName: "",
      jobTitle: "",
    };
  }
 public componentDidMount() {
    this.getItems();
    this.todayBookings();
  }


  private dismissModal = (ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>): any => {
    this.setState({showModal: false, modalContent:{heading:<div></div>, body:<div></div>}});
  }


  private getItems = (): void => {
    let items: floorplan[] = [];
    const request = new SPRequest;
    request.getSPData("/sites/abm-desk-booking", `/_api/web/lists/GetByTitle('ABM Floorplan')/items`).then(response => {
      let responseJSON = JSON.parse(response.response);
      responseJSON.d.results.map((listItem: any) => {
        items.push({
          id: listItem.Id,
          deskRef: listItem.deskRef,
          jobTitle: listItem.jobTitle,
          userDisplayName: listItem.userDisplayName,
          Initials: listItem.Title,
          email: listItem.email,
          ProfilePic: listItem.ProfilePic,
          userDesk: listItem.userDesk,
        });     
        this.setState({deskItems: items});
        this.setState({jobTitle: listItem.JobTitle})
      });
    });    
  }

  private todayBookings() {
    var today = new Date();
    var twoDigitMonth = ((today.getMonth()+1) === 1)? (today.getMonth()+1) : '0' + (today.getMonth()+1);
    var currentDate = today.getDate() + "/" + twoDigitMonth + "/" + today.getFullYear();
    var splitToday = currentDate.split("/");
    var todayDate = new Date(Number(splitToday[2]), Number(splitToday[1]) - 1, Number(splitToday[0]));
    let desks: desk[] = [];
    const request = new SPRequest;
    request.getSPData("/sites/abm-desk-booking" , `/_api/web/lists/GetByTitle('Book My Desk')/items`).then(response => {
      let responseJSON = JSON.parse(response.response);
      responseJSON.d.results.map((listItem: any) => {
        desks.push({
          id: listItem.Id,
          deskRef: listItem.Title,
          startDate: listItem.Start,
          endDate: listItem.End,
          profilePic: listItem.ProfilePic,
          jobTitle: listItem.JobTitle,
          userName: listItem.userDisplayName,
          initials: listItem.Initials,
        });     
        
          //if(new Date(listItem.Start) <= todayDate && new Date(listItem.End) >= todayDate)
          if(new Date(listItem.Start) <= todayDate && new Date(listItem.End) >= todayDate)
          { 
              this.setState({bookedDesks: desks});
              this.setState({profilePic: listItem.ProfilePic});
              this.setState({deskRef: listItem.Title});
              this.setState({userName: listItem.userDisplayName});
              this.setState({initials: listItem.Initials});
              this.setState({jobTitle: listItem.JobTitle});
              console.log("desk8  " + this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.userName +  this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.jobTitle)
          }
          
         
      });
    });    
  }


  private DeskBookings() {
    let dateSelected = document.getElementById('dateSelected');
    
    var today = new Date();
    var twoDigitMonth = ((today.getMonth()+1) === 1)? (today.getMonth()+1) : '0' + (today.getMonth()+1);
    var currentDate = today.getDate() + "/" + twoDigitMonth + "/" + today.getFullYear();
    var splitToday = currentDate.split("/");
    var todayDate = new Date(Number(splitToday[2]), Number(splitToday[1]) - 1, Number(splitToday[0]));
    let desks: desk[] = [];
    const request = new SPRequest;
    request.getSPData("/sites/abm-desk-booking" , `/_api/web/lists/GetByTitle('Book My Desk')/items`).then(response => {
      let responseJSON = JSON.parse(response.response);
      responseJSON.d.results.map((listItem: any) => {
        desks.push({
          id: listItem.Id,
          deskRef: listItem.DeskNo,
          startDate: listItem.Start,
          endDate: listItem.End,
          profilePic: listItem.ProfilePic,
          jobTitle: listItem.JobTitle,
          userName: listItem.userDisplayName,
          initials: listItem.Initials,
        });     
        
        console.log("selected date " + dateSelected)
        console.log("today " + todayDate)

          
      });
    });    
  }


  public render(): React.ReactElement<IDeskBookingProps> { 
    return (
       <><div className={styles.deskBooking}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
            
                <span style={{ marginBottom: "2%" }}>
                  <input style={{ marginLeft: "-15%" }} onClick={() => this.DeskBookings()} type="button" value="Check Date" id="checkDate" className={styles.button} />&nbsp;&nbsp;&nbsp;
                  <input type="button" value="Clear Search" onClick={()=> window.location.reload} id="clearDate" className={styles.button} />&nbsp;&nbsp;&nbsp;
                  <a href="#" onClick={()=>window.open('/sites/abm-desk-booking/Lists/Desk%20Booking/NewForm.aspx','pagename','resizable,height=600,width=800')}><input type='button' value="Reserve Your Spot" className={styles.button} /></a>&nbsp;&nbsp;&nbsp;
                  <a href='/sites/abm-desk-booking/SitePages/My-Bookings.aspx'><input type='button' value='View My Bookings' className={styles.button} /></a>
                </span>&nbsp;&nbsp;&nbsp;
                  
          
          <br />
          
            <img src='/sites/abm-desk-booking/SiteAssets/floorplanNoNumbers.jpg' style={{position: "relative"}}/>
            <div onClick={() => this.setState({showModal: true, modalContent: {heading: this.state.deskItems.find(floorplan => floorplan.deskRef == "desk1")?.userDisplayName, body: <div>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk1")?.jobTitle }</div>}}) } id={styles.desk1} className={styles.unavailable} style={{backgroundColor:"#ffff66;"}}>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk1")?.Initials}<br/></div>
            <div onClick={() => this.setState({showModal: true, modalContent: {heading: this.state.deskItems.find(floorplan => floorplan.deskRef == "desk2")?.userDisplayName, body: <div>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk2")?.jobTitle } </div> }}) } id={styles.desk2} className={styles.unavailable} style={{backgroundColor:"#ffff66;"}}>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk2")?.Initials}<br/></div>	
            <div onClick={() => this.setState({showModal: true, modalContent: {heading: this.state.deskItems.find(floorplan => floorplan.deskRef == "desk3")?.userDisplayName, body: <div>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk3")?.jobTitle } </div> }}) } id={styles.desk3} className={styles.unavailable} style={{backgroundColor:"#ffff66;"}}>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk3")?.Initials}<br/></div>	
            <div onClick={() => this.setState({showModal: true, modalContent: {heading: this.state.deskItems.find(floorplan => floorplan.deskRef == "desk4")?.userDisplayName, body: <div>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk4")?.jobTitle } </div> }}) } id={styles.desk4} className={styles.unavailable} style={{backgroundColor:"#ffff66;"}}>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk4")?.Initials}<br/></div> 

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.deskRef != "desk5" &&
              <div id={styles.desk5} className={styles.marker} style={{ backgroundColor: "#ffff55;" }}>5<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.deskRef == "desk5" && this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.jobTitle }</div>}})} id={styles.desk5}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.deskRef == "desk5" && this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.jobTitle }</div>}})} id={styles.desk5}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk5")?.profilePic} /><br /></div>}


            {this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.deskRef != "desk6" &&
              <div id={styles.desk6} className={styles.marker} style={{ backgroundColor: "#ffff66;" }}>6<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.deskRef == "desk6" && this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.jobTitle }</div>}})} id={styles.desk6}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.deskRef == "desk6" && this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.jobTitle }</div>}})} id={styles.desk6}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk6")?.profilePic} /><br /></div>}


            {this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.deskRef != "desk7" &&
              <div id={styles.desk7} className={styles.marker} style={{ backgroundColor: "#ffff77;" }}>7<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.deskRef == "desk7" && this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.jobTitle }</div>}})} id={styles.desk7}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.deskRef == "desk7" && this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.jobTitle }</div>}})} id={styles.desk7}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk7")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.deskRef != "desk8" &&
              <div id={styles.desk8} className={styles.marker} style={{ backgroundColor: "#ffff88;" }}>8<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.deskRef == "desk8" && this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.jobTitle }</div>}})} id={styles.desk8}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.deskRef == "desk8" && this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.jobTitle }</div>}})} id={styles.desk8}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk8")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.deskRef != "desk9" == true &&
              <div id={styles.desk9} className={styles.marker} style={{ backgroundColor: "#ffff99;" }}>9<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.deskRef == "desk9" == true && this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.jobTitle }</div>}})} id={styles.desk9}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.deskRef == "desk9" == true && this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.jobTitle }</div>}})} id={styles.desk9}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk9")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.deskRef != "desk10" &&
              <div id={styles.desk10} className={styles.marker} style={{ backgroundColor: "#ffff1010;" }}>10<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.deskRef == "desk10" && this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.jobTitle }</div>}})} id={styles.desk10}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.deskRef == "desk10" && this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.jobTitle }</div>}})} id={styles.desk10}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.deskRef != "desk11" &&
              <div id={styles.desk11} className={styles.marker} style={{ backgroundColor: "#ffff1111;" }}>11<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.deskRef == "desk11" && this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.jobTitle }</div>}})} id={styles.desk11}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.deskRef == "desk11" && this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.jobTitle }</div>}})} id={styles.desk11}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk11")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.deskRef != "desk12" &&
              <div id={styles.desk12} className={styles.marker} style={{ backgroundColor: "#ffff1212;" }}>12<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.deskRef == "desk12" && this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.jobTitle }</div>}})} id={styles.desk12}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.deskRef == "desk12" && this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.jobTitle }</div>}})} id={styles.desk12}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk12")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.deskRef != "desk13" &&
              <div id={styles.desk13} className={styles.marker} style={{ backgroundColor: "#ffff1313;" }}>13<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.deskRef == "desk13" && this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.jobTitle }</div>}})} id={styles.desk13}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.deskRef == "desk13" && this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.jobTitle }</div>}})} id={styles.desk13}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk13")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.deskRef != "desk14" &&
              <div id={styles.desk14} className={styles.marker} style={{ backgroundColor: "#ffff1414;" }}>14<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.deskRef == "desk14" && this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.jobTitle }</div>}})} id={styles.desk14}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.deskRef == "desk14" && this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.jobTitle }</div>}})} id={styles.desk14}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk14")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.deskRef != "desk15" &&
              <div id={styles.desk15} className={styles.marker} style={{ backgroundColor: "#ffff1515;" }}>15<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.deskRef == "desk15" && this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.jobTitle }</div>}})} id={styles.desk15}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.deskRef == "desk15" && this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.jobTitle }</div>}})} id={styles.desk15}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk15")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.deskRef != "desk16" &&
              <div id={styles.desk16} className={styles.marker} style={{ backgroundColor: "#ffff1616;" }}>16<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.deskRef == "desk16" && this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.jobTitle }</div>}})} id={styles.desk16}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.deskRef == "desk16" && this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.jobTitle }</div>}})} id={styles.desk16}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk16")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.deskRef != "desk17" &&
              <div id={styles.desk17} className={styles.marker} style={{ backgroundColor: "#ffff1717;" }}>17<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.deskRef == "desk17" && this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.jobTitle }</div>}})} id={styles.desk17}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.deskRef == "desk17" && this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.jobTitle }</div>}})} id={styles.desk17}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk17")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.deskRef != "desk18" &&
              <div id={styles.desk18} className={styles.marker} style={{ backgroundColor: "#ffff1818;" }}>18<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.deskRef == "desk18" && this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.jobTitle }</div>}})} id={styles.desk18}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.deskRef == "desk18" && this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.jobTitle }</div>}})} id={styles.desk18}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk18")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.deskRef != "desk19" &&
              <div id={styles.desk19} className={styles.marker} style={{ backgroundColor: "#ffff1919;" }}>19<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.deskRef == "desk19" && this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.jobTitle }</div>}})} id={styles.desk19}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.deskRef == "desk19" && this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.jobTitle }</div>}})} id={styles.desk19}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk19")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.deskRef != "desk20" &&
              <div id={styles.desk20} className={styles.marker} style={{ backgroundColor: "#ffff2020;" }}>20<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.deskRef == "desk20" && this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk10")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.jobTitle }</div>}})} id={styles.desk20}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.deskRef == "desk20" && this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.jobTitle }</div>}})} id={styles.desk20}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk20")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.deskRef != "desk21" &&
              <div id={styles.desk21} className={styles.marker} style={{ backgroundColor: "#ffff2121;" }}>21<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.deskRef == "desk21" && this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.jobTitle }</div>}})} id={styles.desk21}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.deskRef == "desk21" && this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.jobTitle }</div>}})} id={styles.desk21}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk21")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.deskRef != "desk22" &&
              <div id={styles.desk22} className={styles.marker} style={{ backgroundColor: "#ffff2222;" }}>22<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.deskRef == "desk22" && this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.jobTitle }</div>}})} id={styles.desk22}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.deskRef == "desk22" && this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.jobTitle }</div>}})} id={styles.desk22}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk22")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.deskRef != "desk23" &&
              <div id={styles.desk23} className={styles.marker} style={{ backgroundColor: "#ffff2323;" }}>23<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.deskRef == "desk23" && this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.jobTitle }</div>}})} id={styles.desk23}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.deskRef == "desk23" && this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.jobTitle }</div>}})} id={styles.desk23}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk23")?.profilePic} /><br /></div>}
            
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.deskRef != "desk24" &&
              <div id={styles.desk24} className={styles.marker} style={{ backgroundColor: "#ffff2424;" }}>24<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.deskRef == "desk24" && this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.jobTitle }</div>}})} id={styles.desk24}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.deskRef == "desk24" && this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.jobTitle }</div>}})} id={styles.desk24}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk24")?.profilePic} /><br /></div>}
            
            <div onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.deskItems.find(floorplan => floorplan.deskRef == "desk25")?.userDisplayName, body: <div>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk25")?.jobTitle } </div> } })} id={styles.desk25} className={styles.unavailable} style={{ backgroundColor: "#ffff66;" }}><img className={styles.markerCircle} src={this.state.deskItems.find(floorplan => floorplan.deskRef == "desk25")?.ProfilePic} /><br /></div>
            <div onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.deskItems.find(floorplan => floorplan.deskRef == "desk26")?.userDisplayName, body: <div>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk26")?.jobTitle } </div> } })} id={styles.desk26} className={styles.unavailable} style={{ backgroundColor: "#ffff66;" }}><img className={styles.markerCircle} src={this.state.deskItems.find(floorplan => floorplan.deskRef == "desk26")?.ProfilePic} /><br /></div>

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.deskRef != "desk27" && 
              <div id={styles.desk27} className={styles.marker} style={{ backgroundColor: "#ffff2727;" }}>27<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.deskRef == "desk27" && this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.jobTitle }</div>}})} id={styles.desk27}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.deskRef == "desk27" && this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.jobTitle }</div>}})} id={styles.desk27}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk27")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.deskRef != "desk28" && 
              <div id={styles.desk28} className={styles.marker} style={{ backgroundColor: "#ffff2727;" }}>28<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.deskRef == "desk28" && this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.jobTitle }</div>}})} id={styles.desk28}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.deskRef == "desk28" && this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.jobTitle }</div>}})} id={styles.desk28}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk28")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.deskRef != "desk29" &&
              <div id={styles.desk29} className={styles.marker} style={{ backgroundColor: "#ffff2929;" }}>29<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.deskRef == "desk29" && this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.jobTitle }</div>}})} id={styles.desk29}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.deskRef == "desk29" && this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.jobTitle }</div>}})} id={styles.desk29}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk29")?.profilePic} /><br /></div>}
            
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.deskRef != "desk30" &&
              <div id={styles.desk30} className={styles.marker} style={{ backgroundColor: "#ffff3030;" }}>30<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.deskRef == "desk30" && this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.jobTitle }</div>}})} id={styles.desk30}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.deskRef == "desk30" && this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.jobTitle }</div>}})} id={styles.desk30}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk30")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.deskRef != "desk31" &&
              <div id={styles.desk31} className={styles.marker} style={{ backgroundColor: "#ffff3131;" }}>31<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.deskRef == "desk31" && this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.jobTitle }</div>}})} id={styles.desk31}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.deskRef == "desk31" && this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.jobTitle }</div>}})} id={styles.desk31}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk31")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.deskRef != "desk32" &&
              <div id={styles.desk32} className={styles.marker} style={{ backgroundColor: "#ffff3232;" }}>32<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.deskRef == "desk32" && this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.jobTitle }</div>}})} id={styles.desk32}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.deskRef == "desk32" && this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.jobTitle }</div>}})} id={styles.desk32}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk32")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.deskRef != "desk33" &&
              <div id={styles.desk33} className={styles.marker} style={{ backgroundColor: "#ffff3333;" }}>33<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.deskRef == "desk33" && this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.jobTitle }</div>}})} id={styles.desk33}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.deskRef == "desk33" && this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.jobTitle }</div>}})} id={styles.desk33}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk33")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.deskRef != "desk34" &&
              <div id={styles.desk34} className={styles.marker} style={{ backgroundColor: "#ffff3434;" }}>34<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.deskRef == "desk34" && this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.jobTitle }</div>}})} id={styles.desk34}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.deskRef == "desk34" && this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.jobTitle }</div>}})} id={styles.desk34}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk34")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.deskRef != "desk35" &&
              <div id={styles.desk35} className={styles.marker} style={{ backgroundColor: "#ffff3535;" }}>35<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.deskRef == "desk35" && this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.jobTitle }</div>}})} id={styles.desk35}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.deskRef == "desk35" && this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.jobTitle }</div>}})} id={styles.desk35}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk35")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.deskRef != "desk36" &&
              <div id={styles.desk36} className={styles.marker} style={{ backgroundColor: "#ffff3636;" }}>36<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.deskRef == "desk36" && this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.jobTitle }</div>}})} id={styles.desk36}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.deskRef == "desk36" && this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.jobTitle }</div>}})} id={styles.desk36}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk36")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.deskRef != "desk37" &&
              <div id={styles.desk37} className={styles.marker} style={{ backgroundColor: "#ffff3737;" }}>37<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.deskRef == "desk37" && this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.jobTitle }</div>}})} id={styles.desk37}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.deskRef == "desk37" && this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.jobTitle }</div>}})} id={styles.desk37}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk37")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.deskRef != "desk38" &&
              <div id={styles.desk38} className={styles.marker} style={{ backgroundColor: "#ffff3838;" }}>38<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.deskRef == "desk38" && this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.jobTitle }</div>}})} id={styles.desk38}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.deskRef == "desk38" && this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.jobTitle }</div>}})} id={styles.desk38}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk38")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.deskRef != "desk39" &&
              <div id={styles.desk39} className={styles.marker} style={{ backgroundColor: "#ffff3939;" }}>39<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.deskRef == "desk39" && this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.jobTitle }</div>}})} id={styles.desk39}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.deskRef == "desk39" && this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.jobTitle }</div>}})} id={styles.desk39}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk39")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.deskRef != "desk40" &&
              <div id={styles.desk40} className={styles.marker} style={{ backgroundColor: "#ffff4040;" }}>40<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.deskRef == "desk40" && this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.jobTitle }</div>}})} id={styles.desk40}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.deskRef == "desk40" && this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.jobTitle }</div>}})} id={styles.desk40}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk40")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.deskRef != "desk41" &&
              <div id={styles.desk41} className={styles.marker} style={{ backgroundColor: "#ffff4141;" }}>41<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.deskRef == "desk41" && this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.jobTitle }</div>}})} id={styles.desk41}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.deskRef == "desk41" && this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.jobTitle }</div>}})} id={styles.desk41}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk41")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.deskRef != "desk42" &&
              <div id={styles.desk42} className={styles.marker} style={{ backgroundColor: "#ffff4242;" }}>42<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.deskRef == "desk42" && this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.jobTitle }</div>}})} id={styles.desk42}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.deskRef == "desk42" && this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.jobTitle }</div>}})} id={styles.desk42}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk42")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.deskRef != "desk43" &&
              <div id={styles.desk43} className={styles.marker} style={{ backgroundColor: "#ffff4343;" }}>43<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.deskRef == "desk43" && this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.jobTitle }</div>}})} id={styles.desk43}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.deskRef == "desk43" && this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.jobTitle }</div>}})} id={styles.desk43}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk43")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.deskRef != "desk44" &&
              <div id={styles.desk44} className={styles.marker} style={{ backgroundColor: "#ffff4444;" }}>44<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.deskRef == "desk44" && this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.jobTitle }</div>}})} id={styles.desk44}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.deskRef == "desk44" && this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.jobTitle }</div>}})} id={styles.desk44}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk44")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.deskRef != "desk45" &&
              <div id={styles.desk45} className={styles.marker} style={{ backgroundColor: "#ffff88;" }}>45<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.deskRef == "desk45" && this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.jobTitle }</div>}})} id={styles.desk45}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.deskRef == "desk45" && this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.jobTitle }</div>}})} id={styles.desk45}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk45")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.deskRef != "desk46" &&
              <div id={styles.desk46} className={styles.marker} style={{ backgroundColor: "#ffff88;" }}>46<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.deskRef == "desk46" && this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.jobTitle }</div>}})} id={styles.desk46}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.deskRef == "desk46" && this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.jobTitle }</div>}})} id={styles.desk46}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk46")?.profilePic} /><br /></div>}
          
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.deskRef != "desk47" &&
              <div id={styles.desk47} className={styles.marker} style={{ backgroundColor: "#ffff4747;" }}>47<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.deskRef == "desk47" && this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.jobTitle }</div>}})} id={styles.desk47}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.deskRef == "desk47" && this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.jobTitle }</div>}})} id={styles.desk47}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk47")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.deskRef != "desk48" &&
              <div id={styles.desk48} className={styles.marker} style={{ backgroundColor: "#ffff4848;" }}>48<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.deskRef == "desk48" && this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.jobTitle }</div>}})} id={styles.desk48}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.deskRef == "desk48" && this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.jobTitle }</div>}})} id={styles.desk48}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.deskRef != "desk49" &&
              <div id={styles.desk49} className={styles.marker} style={{ backgroundColor: "#ffff4949;" }}>49<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.deskRef == "desk49" && this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.jobTitle }</div>}})} id={styles.desk49}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.deskRef == "desk49" && this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.jobTitle }</div>}})} id={styles.desk49}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk49")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.deskRef != "desk50" &&
              <div id={styles.desk50} className={styles.marker} style={{ backgroundColor: "#ffff5050;" }}>50<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.deskRef == "desk50" && this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.jobTitle }</div>}})} id={styles.desk50}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.deskRef == "desk50" && this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.jobTitle }</div>}})} id={styles.desk50}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk50")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.deskRef != "desk51" &&
              <div id={styles.desk51} className={styles.marker} style={{ backgroundColor: "#ffff5151;" }}>51<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.deskRef == "desk51" && this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.jobTitle }</div>}})} id={styles.desk51}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.deskRef == "desk51" && this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.jobTitle }</div>}})} id={styles.desk51}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk51")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.deskRef != "desk52" &&
              <div id={styles.desk52} className={styles.marker} style={{ backgroundColor: "#ffff5252;" }}>52<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.deskRef == "desk52" && this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.jobTitle }</div>}})} id={styles.desk52}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.deskRef == "desk52" && this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.jobTitle }</div>}})} id={styles.desk52}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk52")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.deskRef != "desk53" &&
              <div id={styles.desk53} className={styles.marker} style={{ backgroundColor: "#ffff5353;" }}>53<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.deskRef == "desk53" && this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.jobTitle }</div>}})} id={styles.desk53}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.deskRef == "desk53" && this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.jobTitle }</div>}})} id={styles.desk53}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk53")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.deskRef != "desk54" &&
              <div id={styles.desk54} className={styles.marker} style={{ backgroundColor: "#ffff5454;" }}>54<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.deskRef == "desk54" && this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.jobTitle }</div>}})} id={styles.desk54}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.deskRef == "desk54" && this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.jobTitle }</div>}})} id={styles.desk54}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk54")?.profilePic} /><br /></div>}

            <div onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.deskItems.find(floorplan => floorplan.deskRef == "desk55")?.userDisplayName, body: <div>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk55")?.jobTitle } </div> } })} id={styles.desk55} className={styles.unavailable} style={{ backgroundColor: "#ffff66;" }}>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk55")?.Initials}<br /></div>
            <div onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.deskItems.find(floorplan => floorplan.deskRef == "desk56")?.userDisplayName, body: <div>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk56")?.jobTitle } </div> } })} id={styles.desk56} className={styles.unavailable} style={{ backgroundColor: "#ffff66;" }}>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk56")?.Initials}<br /></div>
            <div onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.deskItems.find(floorplan => floorplan.deskRef == "desk57")?.userDisplayName, body: <div>{this.state.deskItems.find(floorplan => floorplan.deskRef == "desk57")?.jobTitle } </div> } })} id={styles.desk57} className={styles.unavailable} style={{ backgroundColor: "#ffff66;" }}><img className={styles.markerCircle} src={this.state.deskItems.find(floorplan => floorplan.deskRef == "desk57")?.ProfilePic} /><br /></div>

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.deskRef != "desk58" &&
              <div id={styles.desk58} className={styles.marker} style={{ backgroundColor: "#ffff5858;" }}>58<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.deskRef == "desk58" && this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk48")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.jobTitle }</div>}})} id={styles.desk58}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.deskRef == "desk58" && this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.jobTitle }</div>}})} id={styles.desk58}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk58")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.deskRef != "desk59" &&
              <div id={styles.desk59} className={styles.marker} style={{ backgroundColor: "#ffff5959;" }}>59<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.deskRef == "desk59" && this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.jobTitle }</div>}})} id={styles.desk59}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.deskRef == "desk59" && this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.jobTitle }</div>}})} id={styles.desk59}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk59")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.deskRef != "desk60" &&
              <div id={styles.desk60} className={styles.marker} style={{ backgroundColor: "#ffff6060;" }}>60<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.deskRef == "desk60" && this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.jobTitle }</div>}})} id={styles.desk60}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.deskRef == "desk60" && this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.jobTitle }</div>}})} id={styles.desk60}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk60")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.deskRef != "desk61" &&
              <div id={styles.desk61} className={styles.marker} style={{ backgroundColor: "#ffff6161;" }}>61<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.deskRef == "desk61" && this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.jobTitle }</div>}})} id={styles.desk61}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.deskRef == "desk61" && this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.jobTitle }</div>}})} id={styles.desk61}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk61")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.deskRef != "desk62" &&
              <div id={styles.desk62} className={styles.marker} style={{ backgroundColor: "#ffff6262;" }}>62<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.deskRef == "desk62" && this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.jobTitle }</div>}})} id={styles.desk62}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.deskRef == "desk62" && this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.jobTitle }</div>}})} id={styles.desk62}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk62")?.profilePic} /><br /></div>}

            {this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.deskRef != "desk63" &&
              <div id={styles.desk63} className={styles.marker} style={{ backgroundColor: "#ffff6363;" }}>63<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.deskRef == "desk63" && this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.profilePic == null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.jobTitle }</div>}})} id={styles.desk63}>{this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.initials}<br /></div>}
            {this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.deskRef == "desk63" && this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.profilePic != null &&
              <div className={styles.dateBooked} onClick={() => this.setState({ showModal: true, modalContent: { heading: this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.userName, body: <div>{this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.jobTitle }</div>}})} id={styles.desk63}><img className={styles.markerCircle} src={this.state.bookedDesks.find(desks => desks.deskRef == "desk63")?.profilePic} /><br /></div>}

          </div>
          </div>
        </div>
      </div><AbmModal body={this.state.modalContent.body} showModal={this.state.showModal} dismissModal={this.dismissModal} heading={this.state.modalContent.heading}></AbmModal></>
      

    );
}

}



