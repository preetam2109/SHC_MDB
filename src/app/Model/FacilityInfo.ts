export class FacilityInfo{
    facilityid: number;
    districtname: string;
    locationname: string | null;
    facilityname: string;
    parentfac: string | null;
    longitude: string;
    latitude: string;
    phonE1: string | null;
    mfacility: string;
    contactpersonname: string | null;
    facilitycode: string;
    districtid: number;
    facilitytypecode: string;
    facilitytypedesc: string;
    eldcat: number;
    warehouseid: number;
    warehousename: string;
    whemail: string;
    whcontact: string;
    userid: number;
    emailid: string;
  
    // Constructor to initialize the properties
    constructor(
      facilityid: number,
      districtname: string,
      locationname: string | null,
      facilityname: string,
      parentfac: string | null,
      longitude: string,
      latitude: string,
      phonE1: string | null,
      mfacility: string,
      contactpersonname: string | null,
      facilitycode: string,
      districtid: number,
      facilitytypecode: string,
      facilitytypedesc: string,
      eldcat: number,
      warehouseid: number,
      warehousename: string,
      whemail: string,
      whcontact: string,
      userid: number,
      emailid: string
    ) {
      this.facilityid = facilityid;
      this.districtname = districtname;
      this.locationname = locationname;
      this.facilityname = facilityname;
      this.parentfac = parentfac;
      this.longitude = longitude;
      this.latitude = latitude;
      this.phonE1 = phonE1;
      this.mfacility = mfacility;
      this.contactpersonname = contactpersonname;
      this.facilitycode = facilitycode;
      this.districtid = districtid;
      this.facilitytypecode = facilitytypecode;
      this.facilitytypedesc = facilitytypedesc;
      this.eldcat = eldcat;
      this.warehouseid = warehouseid;
      this.warehousename = warehousename;
      this.whemail = whemail;
      this.whcontact = whcontact;
      this.userid = userid;
      this.emailid = emailid;
    }
}