import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuotationApprovalComponent } from './quotation-approval/quotation-approval.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/ConfigService';
import { LayoutComponent } from './layout/layout.component';
import { OnlyNumber } from './shared/validations/OnlyNumber';
import { OnlyNumberWithDecimal } from './shared/validations/OnlyNumberWithDecimal';

@NgModule({
  declarations: [
    AppComponent,
    QuotationApprovalComponent,
    LayoutComponent,
    OnlyNumber,
    OnlyNumberWithDecimal
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
