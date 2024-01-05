import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotationApprovalComponent } from './quotation-approval/quotation-approval.component';
import { LayoutComponent } from './layout/layout.component';


const routes: Routes = [
  {path : '' ,  redirectTo: '/layout', pathMatch: 'full'},
  {path : 'layout', component :LayoutComponent,
  children : [
    {path: '', redirectTo: 'quotation-approval', pathMatch: 'full'},
    { path: 'quotation-approval', component: QuotationApprovalComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
