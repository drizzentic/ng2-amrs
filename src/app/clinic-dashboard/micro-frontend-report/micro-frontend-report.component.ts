import { Component, OnInit, OnDestroy } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "micro-frontend-reports",
  templateUrl: "./micro-frontend-report.component.html",
  styleUrls: ["./micro-frontend-report.component.css"],
})
export class MicroFrontendReportComponent implements OnInit {
  public url: SafeResourceUrl;
  private baseUrl = "http://localhost:8080";

  receiveMessage(e: MessageEvent) {
    console.log(e.origin);
    if (e.origin === this.baseUrl) {
      console.log(e.data);
    }
  }

  sendMessageToReportIframe(message: any) {
    document
      .getElementsByTagName("iframe")[0]
      .contentWindow.postMessage(message, this.baseUrl);
  }

  constructor(private sanitizer: DomSanitizer) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.baseUrl}/amrs/spa/home`
    );
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }

  ngOnInit(): void {}
}
