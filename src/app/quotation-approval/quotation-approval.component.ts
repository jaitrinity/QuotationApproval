import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../services/ConfigService';
import { Constant } from '../constant/Contant';
import { LayoutComponent } from '../layout/layout.component';
declare var $: any;

@Component({
  selector: 'app-quotation-approval',
  templateUrl: './quotation-approval.component.html',
  styleUrls: ['./quotation-approval.component.css']
})
export class QuotationApprovalComponent implements OnInit {
  @ViewChild('poFile') poFileVariable: ElementRef;
  public empId : string = "";
  public quotId : string = "";
  public role : string = "";
  public remark : string = "";
  public pendingFor : string = "";
  public status : string = "";
  public poAttachStr : any = "";
  public isPartialPO : boolean = true;
  public isCompletePO : boolean = false;
  public actionList = [];
  public auditList = [];
  public projectDetails : any;
  public projectId : string = "";
  public brand : string = "";
  public pipImagUrl1 : string = "";
  public pipImagUrl2 : string = "";
  public pipImagUrl3 : string = "";
  public isHW : boolean = false; // For Hindware
  public isBL : boolean = false; // For Benelave
  public isLS : boolean = false; // For Lifestyle
  // Hindware Variables
  public hwItalianValue : string = "";
  public hwItalianValueNew : string = "";
  public hwNonItalianValue : string = "";
  public hwNonItalianValueNew : string = "";
  public hwFaucetsValue : string = "";
  public hwFaucetsValueNew : string = "";
  public hwOtherValue : string = "";
  public hwOtherValueNew : string = "";
  public pvcCisternsValue : string = "";
  public pvcCisternsValueNew : string = "";
  public pvcCisternsBath : string = "";
  public pvcCisternsBathNew : string = "";
  public concealoValue : string = "";
  public concealoValueNew : string = "";
  public concealoBath : string = "";
  public concealoBathNew : string = "";
  // Benelave Variables
  public blSWValue : string = "";
  public blSWValueNew : string = "";
  public blFaucetsValue : string = "";
  public blFaucetsValueNew : string = "";
  public blOtherValue : string = "";
  public blOtherValueNew : string = "";
  // Lifestyle Variables
  public queoSWValue : string = "";
  public queoSWValueNew : string = "";
  public queoFaucetsValue : string = "";
  public queoFaucetsValueNew : string = "";
  public amoreValue : string = "";
  public amoreValueNew : string = "";
  public lsOtherValue : string = "";
  public lsOtherValueNew : string = "";
  public allTotal : number = 0;
  public pvcCisterns : number = 0.0065;
  public concealo : number = 0.034;

  constructor(private activateRoute: ActivatedRoute, private router:Router, 
    private configService : ConfigService, private layoutComponent : LayoutComponent) { 
    this.activateRoute.queryParams.subscribe(params => {
      this.empId = params['empId'];
      this.quotId = params['quotId'];
      this.projectId = params['projectId'];
      this.role = params['role'];
    });
  }

  ngOnInit(): void {
    if(this.role != "Commercial")
      this.getQuotationForApproval();
    else
      this.getProjectPOList();
  }

  getQuotationForApproval(){
    if(this.quotId == "" || this.quotId == undefined){
      alert("invalid url")
      return;
    }
    this.layoutComponent.ShowLoading = true;
    let jsonData = {
      quotId : this.quotId,
      role : this.role
    }
    this.configService.getPostRequestData(jsonData, "getQuotationForApproval")
      .subscribe(response => {
        // console.log(JSON.stringify(response));
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.actionList = response.wrappedList;
          this.auditList = response.auditList;
          this.projectDetails = response.projectDetails;
          if(this.projectDetails != ""){
            this.projectId = this.projectDetails.PROJECT_ID;
            this.brand = this.projectDetails.BRAND;
            this.pipImagUrl1 = this.projectDetails.PIP_IMAGE_URL_1;
            this.pipImagUrl2 = this.projectDetails.PIP_IMAGE_URL_2;
            this.pipImagUrl3 = this.projectDetails.PIP_IMAGE_URL_3;
            // console.log(this.brand+" "+this.brand.indexOf("Benelave"))
            if(this.brand.indexOf("Hindware") >= 0) this.isHW = true; 
            if(this.brand.indexOf("Benelave") >= 0) this.isBL = true; 
            if(this.brand.indexOf("Lifestyle") >= 0) this.isLS = true; 
            // HW
            this.hwItalianValue = this.projectDetails.HW_ITALIAN_VAL;
            this.hwNonItalianValue = this.projectDetails.HW_NON_ITALIAN_VAL;
            this.hwFaucetsValue = this.projectDetails.HW_FAUCETS_VAL;
            this.hwOtherValue = this.projectDetails.HW_Other_Value;
            this.pvcCisternsValue = this.projectDetails.PVC_CISTERNS_VAL;
            this.pvcCisternsBath = this.projectDetails.PVC_CISTERNS_BATH;
            this.concealoValue =  this.projectDetails.CONCEALO_VAL;
            this.concealoBath = this.projectDetails.CONCEALO_BATH;

            // BL
            this.blSWValue = this.projectDetails.BENELAVE_SW_VAL;
            this.blFaucetsValue = this.projectDetails.BENELAVE_FAUCETS_VAL;
            this.blOtherValue = this.projectDetails.BENELAVE_Other_Value;

            // LS
            this.queoSWValue = this.projectDetails.QUEO_SW_VAL
            this.queoFaucetsValue = this.projectDetails.QUEO_FAUCETS_VAL
            this.amoreValue = this.projectDetails.AMORE_VAL
            this.lsOtherValue = this.projectDetails.LS_Other_Value

          }
          
          if(this.actionList.length == 0){
            this.pendingFor = response.pendingFor;
          }
          else{
            this.status = response.status;
          }
        }
        else if(response.responseCode == Constant.NO_RECORDS_FOUND_CODE){
          alert(response.responseDesc);
        }
        else{
          alert("Something went wrong");
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{
        alert(Constant.returnServerErrorMessage("getQuotationForApproval"));
        this.layoutComponent.ShowLoading = false;
      }
    );
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    let wrongFile = false;
    let fileName = file.name;
    if(!(fileName.indexOf(".jpg") > -1 || fileName.indexOf(".jpeg") > -1 || 
    fileName.indexOf(".png") > -1 || fileName.indexOf(".pdf") > -1)){
      // alert("only .jpg,.jpeg,.png,.pdf format accepted");
      alert("only .jpg, .jpeg, .png, .pdf format accepted, please choose right file.");
      wrongFile = true;
    }
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let image = myReader.result;
      this.poAttachStr = image;
      if(wrongFile){
        this.poFileVariable.nativeElement.value = "";
        this.poAttachStr = "";
      }
    }
    myReader.readAsDataURL(file);
  }

  validatePoData() : any{
    // if(this.hwItalianValueNew == "" && this.isHW){
    //   alert("please enter `HW Italian` new value ")
    //   return false;
    // }
    // else if(this.hwNonItalianValueNew == "" && this.isHW){
    //   alert("please enter `HW Non Italian` new value ")
    //   return false;
    // }
    // else if(this.hwFaucetsValueNew == "" && this.isHW){
    //   alert("please enter `HW Faucets` new value ")
    //   return false;
    // }
    // else if(this.hwOtherValueNew == "" && this.isHW){
    //   alert("please enter Hindware `Others` new value ")
    //   return false;
    // }
    // else if(this.pvcCisternsValueNew == "" && this.isHW){
    //   alert("please enter `PVC Cisterns` new value ")
    //   return false;
    // }
    // else if(this.pvcCisternsBathNew == "" && this.isHW){
    //   alert("please enter `PVC Cisterns` new bath ")
    //   return false;
    // }
    // else if(this.concealoValueNew == "" && this.isHW){
    //   alert("please enter `Concealo` new value ")
    //   return false;
    // }
    // else if(this.concealoBathNew == "" && this.isHW){
    //   alert("please enter `Concealo` new bath ")
    //   return false;
    // }
    // else if(this.blSWValueNew == "" && this.isBL){
    //   alert("please enter `Benelave SW` new value ")
    //   return false;
    // }
    // else if(this.blFaucetsValueNew == "" && this.isBL){
    //   alert("please enter `Benelave Faucets` new value ")
    //   return false;
    // }
    // else if(this.blOtherValueNew == "" && this.isBL){
    //   alert("please enter Benelave `Others` new value ")
    //   return false;
    // }
    // else if(this.queoSWValueNew == "" && this.isLS){
    //   alert("please enter `Queo SW` new value ")
    //   return false;
    // }
    // else if(this.queoFaucetsValueNew == "" && this.isLS){
    //   alert("please enter `Queo Faucets` new value ")
    //   return false;
    // }
    // else if(this.amoreValueNew == "" && this.isLS){
    //   alert("please enter `Amore` new value ")
    //   return false;
    // }
    // else if(this.lsOtherValueNew == "" && this.isLS){
    //   alert("please enter Lifestyle `Others` new value ")
    //   return false;
    // }
    if(this.allTotal == 0){
      alert("PO value should be non zero");
      return false;
    }
    else if(this.poAttachStr == ""){
      alert("please attach PO");
      return false;
    }
    return true;
  }

  actionOnQuotation(buttonType, actionType){
    if(actionType == "QUO_14" && !this.validatePoData()){
      return ;
    }
    
    if(this.remark == ""){
      alert("please enter remark..");
      return ;
    }
    let hwItalianValue = parseInt(this.hwItalianValue) - parseInt(this.hwItalianValueNew);
    let hwNonItalianValue = parseInt(this.hwNonItalianValue) - parseInt(this.hwNonItalianValueNew);
    let hwFaucetsValue = parseInt(this.hwFaucetsValue) - parseInt(this.hwFaucetsValueNew);
    let hwOtherValue = parseInt(this.hwOtherValue) - parseInt(this.hwOtherValueNew);
    let pvcCisternsValue = parseInt(this.pvcCisternsValue) - parseInt(this.pvcCisternsValueNew);
    let pvcCisternsBath = parseInt(this.pvcCisternsBath) - parseInt(this.pvcCisternsBathNew);
    let concealoValue = parseInt(this.concealoValue) - parseInt(this.concealoValueNew);
    let concealoBath = parseInt(this.concealoBath) - parseInt(this.concealoBathNew);
    let blSWValue = parseInt(this.blSWValue) - parseInt(this.blSWValueNew);
    let blFaucetsValue = parseInt(this.blFaucetsValue) - parseInt(this.blFaucetsValueNew);
    let blOtherValue = parseInt(this.blOtherValue) - parseInt(this.blOtherValueNew);
    let queoSWValue = parseInt(this.queoSWValue) - parseInt(this.queoSWValueNew);
    let queoFaucetsValue = parseInt(this.queoFaucetsValue) - parseInt(this.queoFaucetsValueNew);
    let amoreValue = parseInt(this.amoreValue) - parseInt(this.amoreValueNew);
    let lsOtherValue = parseInt(this.lsOtherValue) - parseInt(this.lsOtherValueNew);


    let is_complete_po = this.isCompletePO ? "1" : "0";
    let projectStage = this.isCompletePO ? "Conversion" : "Pipeline";
    let jsonData = {
      empId : this.empId,
      quotId : this.quotId,
      projectId : this.projectId,
      hwItalianValue : hwItalianValue,
      hwItalianValueNew : this.hwItalianValueNew,
      hwNonItalianValue : hwNonItalianValue,
      hwNonItalianValueNew : this.hwNonItalianValueNew,
      hwFaucetsValue : hwFaucetsValue,
      hwFaucetsValueNew : this.hwFaucetsValueNew,
      hwOtherValue : hwOtherValue, 
      hwOtherValueNew : this.hwOtherValueNew,
      pvcCisternsValue : pvcCisternsValue, 
      pvcCisternsValueNew : this.pvcCisternsValueNew,
      pvcCisternsBath : pvcCisternsBath,
      pvcCisternsBathNew : this.pvcCisternsBathNew,
      concealoValue : concealoValue,
      concealoValueNew : this.concealoValueNew,
      concealoBath : concealoBath,
      concealoBathNew : this.concealoBathNew,
      blSWValue : blSWValue,
      blSWValueNew : this.blSWValueNew,
      blFaucetsValue : blFaucetsValue,
      blFaucetsValueNew : this.blFaucetsValueNew,
      blOtherValue : blOtherValue,
      blOtherValueNew : this.blOtherValueNew,
      queoSWValue : queoSWValue,
      queoSWValueNew : this.queoSWValueNew,
      queoFaucetsValue : queoFaucetsValue,
      queoFaucetsValueNew : this.queoFaucetsValueNew,
      amoreValue : amoreValue,
      amoreValueNew : this.amoreValueNew,
      lsOtherValue : lsOtherValue,
      lsOtherValueNew : this.lsOtherValueNew,
      allTotal : this.allTotal,
      role : this.role,
      actionType : actionType,
      projectStage : projectStage,
      is_complete_po : is_complete_po,
      preStatus : this.status,
      isHW : this.isHW,
      isLS : this.isLS,
      isBL : this.isBL, 
      remark : this.remark,
      poAttachStr : this.poAttachStr,
    }

    // console.log(JSON.stringify(jsonData));
    this.layoutComponent.ShowLoading = true;
    this.configService.getPostRequestData(jsonData, "actionOnQuotation")
      .subscribe(response => {
        // console.log(JSON.stringify(response));
        // this.refreshPage();
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          alert("Quotation successfully "+buttonType+".");
          this.layoutComponent.ShowLoading = false;
          location.reload();
        }
        else{
          alert("Something wrong, please check service status");
          this.layoutComponent.ShowLoading = false;
        }
      },
      (error)=>{
        alert(Constant.returnServerErrorMessage("actionOnQuotation"));
        this.layoutComponent.ShowLoading = false;
      }
    );
  }

  downloadQuotationExcel(){
    // let url = "http://www.fast.org.in/Pragati/file/Quotation_Excel_Sheet_"+this.quotId+".xls";
    // window.open(url)
    let jsonData = {
      quotId : this.quotId
    }
    window.open(Constant.phpServiceURL+'downloadQuotationExcel.php?jsonData='+JSON.stringify(jsonData));
    
  }

  enterValue(a,b,event){
    // console.log(event.target.name);
    this.allTotal = 0;
    if(b !== ""){
      if(parseInt(b) > parseInt(a)){
        alert("New value should be less than or equal to Old");
        event.target.value = "";
      }
      else{
        if(event.target.name == "pvcCisterns"){
          let aa = this.pvcCisterns * parseInt(b);
          this.pvcCisternsValueNew = aa.toFixed(3);
        }
        else if(event.target.name == "concealo"){
          let bb = this.concealo * parseInt(b);
          this.concealoValueNew = bb.toFixed(3);
        }
        this.addToAll();
      }
    }
    
  }

  addToAll(){
    // this.allTotal = parseInt(this.hwItalianValueNew == "" ? "0" : this.hwItalianValueNew) + 
    //                 parseInt(this.hwNonItalianValueNew == "" ? "0" : this.hwNonItalianValueNew) +
    //                 parseInt(this.hwFaucetsValueNew == "" ? "0" : this.hwFaucetsValueNew) + 
    //                 parseInt(this.hwOtherValueNew == "" ? "0" : this.hwOtherValueNew) +
    //                 parseInt(this.pvcCisternsValueNew == "" ? "0" : this.pvcCisternsValueNew) + 
    //                 parseInt(this.concealoValueNew == "" ? "0" : this.concealoValueNew) +
    //                 parseInt(this.blSWValueNew == "" ? "0" : this.blSWValueNew) + 
    //                 parseInt(this.blFaucetsValueNew == "" ? "0" : this.blFaucetsValueNew) +
    //                 parseInt(this.blOtherValue == "" ? "0" : this.blOtherValue) + 
    //                 parseInt(this.queoSWValueNew  == "" ? "0" : this.queoSWValueNew) +
    //                 parseInt(this.queoFaucetsValueNew  == "" ? "0" : this.queoFaucetsValueNew) + 
    //                 parseInt(this.amoreValueNew  == "" ? "0" : this.amoreValueNew) +
    //                 parseInt(this.lsOtherValue == "" ? "0" : this.lsOtherValue);
    this.allTotal = 0;
    if(this.isHW){
      this.allTotal += parseInt(this.hwItalianValueNew == "" ? "0" : this.hwItalianValueNew) + 
                    parseInt(this.hwNonItalianValueNew == "" ? "0" : this.hwNonItalianValueNew) +
                    parseInt(this.hwFaucetsValueNew == "" ? "0" : this.hwFaucetsValueNew) + 
                    parseInt(this.hwOtherValueNew == "" ? "0" : this.hwOtherValueNew) +
                    parseInt(this.pvcCisternsValueNew == "" ? "0" : this.pvcCisternsValueNew) + 
                    parseInt(this.concealoValueNew == "" ? "0" : this.concealoValueNew);
    }
    if(this.isBL){
      this.allTotal += parseInt(this.blSWValueNew == "" ? "0" : this.blSWValueNew) + 
                        parseInt(this.blFaucetsValueNew == "" ? "0" : this.blFaucetsValueNew) +
                        parseInt(this.blOtherValue == "" ? "0" : this.blOtherValue);
    }
    if(this.isLS){
      this.allTotal += parseInt(this.queoSWValueNew  == "" ? "0" : this.queoSWValueNew) +
                        parseInt(this.queoFaucetsValueNew  == "" ? "0" : this.queoFaucetsValueNew) + 
                        parseInt(this.amoreValueNew  == "" ? "0" : this.amoreValueNew) +
                        parseInt(this.lsOtherValue == "" ? "0" : this.lsOtherValue);
    }
  }

  refreshPage(){
    this.router.navigateByUrl('/layout', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/layout/quotation-approval']);
    });
  }

  projectPoList = [];
  getProjectPOList(){
    if(this.projectId == "" || this.projectId == undefined){
      alert("invalid url2")
      return;
    }
    this.layoutComponent.ShowLoading = true;
    let jsonData = {
      projectId : this.projectId,
      role : this.role
    }
    this.configService.getPostRequestData(jsonData, "getProjectPOList")
    .subscribe(
      (response) =>{
        // console.log(response);
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.projectPoList = response.wrappedList;
        }
        else if(response.responseCode == Constant.NO_RECORDS_FOUND_CODE){
          alert(response.responseDesc);
        }
        else{
          alert("Something went wrong")
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{
        alert(Constant.returnServerErrorMessage("getProjectPOList"));
        this.layoutComponent.ShowLoading = false;
      }
    );

  }

  projectPoId = "";
  projectPoStatus = "";
  viewPoDetails(poId : any, poStatus : any){
    // console.log(poId)
    this.projectPoId = poId;
    this.projectPoStatus = poStatus;
    for(let i = 0;i<this.projectPoList.length;i++){
      let poObj = this.projectPoList[i];
      let loopPoId = poObj.poId;
      if(loopPoId == poId){
        this.quotId = poObj.quotId;
        if(this.projectPoStatus == "Approved"){
          this.remark = poObj.remark;
        }
        
        this.pipImagUrl1 = poObj.PIP_IMAGE_URL_1;
        this.pipImagUrl2 = poObj.PIP_IMAGE_URL_2;
        this.pipImagUrl3 = poObj.PIP_IMAGE_URL_3;
        let brand = poObj.brand;
        if(brand.indexOf("Hindware") >= 0) this.isHW = true; 
        if(brand.indexOf("Benelave") >= 0) this.isBL = true; 
        if(brand.indexOf("Lifestyle") >= 0) this.isLS = true; 
        // HW
        this.hwItalianValue = poObj.HW_ITALIAN_VAL;
        this.hwNonItalianValue = poObj.HW_NON_ITALIAN_VAL;
        this.hwFaucetsValue = poObj.HW_FAUCETS_VAL;
        this.hwOtherValue = poObj.HW_Other_Value;
        this.pvcCisternsValue = poObj.PVC_CISTERNS_VAL;
        this.pvcCisternsBath = poObj.PVC_CISTERNS_BATH;
        this.concealoValue =  poObj.CONCEALO_VAL;
        this.concealoBath = poObj.CONCEALO_BATH;

        // BL
        this.blSWValue = poObj.BENELAVE_SW_VAL;
        this.blFaucetsValue = poObj.BENELAVE_FAUCETS_VAL;
        this.blOtherValue = poObj.BENELAVE_Other_Value;

        // LS
        this.queoSWValue = poObj.QUEO_SW_VAL;
        this.queoFaucetsValue = poObj.QUEO_FAUCETS_VAL;
        this.amoreValue = poObj.AMORE_VAL;
        this.lsOtherValue = poObj.LS_Other_Value;

        this.allTotal = poObj.TOTAL_VAL;

        // $("#poDetailsModal").modal({
        //   backdrop: "static",
        //   keyboard: false
        // });
        $("#poDetailsModal").modal("show");
        // break;
      } 
    }
  }

  actionOnPO(actionType : any){
    if(this.remark == ""){
      alert("please enter remark..");
      return ;
    }
    this.layoutComponent.ShowLoading = true;
    let jsonData = {
      empId : this.empId,
      poId : this.projectPoId,
      quotId : this.quotId,
      projectId : this.projectId,
      actionType : actionType,
      remark : this.remark
    }
    this.configService.getPostRequestData(jsonData, "actionOnPO")
    .subscribe(
      (response) =>{
        if(response.status){
          alert(response.message);
          $("#poDetailsModal").modal("hide");
          location.reload();
        }else{
          alert(response.message);
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error) =>{
        alert(Constant.returnServerErrorMessage("actionOnPO"));
        this.layoutComponent.ShowLoading = false;
      }
    );
  }

  showBigImg(imgUrl){
    window.open(imgUrl);
  }

  closeAnyModal(modalName : string){
    $("#"+modalName).modal("hide");
  }
}
