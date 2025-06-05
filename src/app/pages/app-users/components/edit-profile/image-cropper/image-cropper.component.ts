import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-image-cropper",
  templateUrl: "./image-cropper.component.html",
  styleUrls: ["./image-cropper.component.scss"],
})
export class ImageCropperComponent implements OnInit {
  transform: ImageTransform = {};

  constructor(
    private toast: ToastrService,
    public activeModal: NgbActiveModal
  ) {}

  imageChangedEvent: any = null;
  croppedImage: any = "";
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  @Input() data: any;
  @Output() croppedImageEvent = new EventEmitter<File>();

  @ViewChild(ImageCropperComponent, { static: true })
  imageCropper: ImageCropperComponent;

  ngOnInit(): void {
    this.imageChangedEvent = this.data.file;
  }

  cropImage() {
    if (this.croppedImage) {
      // const blob = this.dataURLtoBlob(this.croppedImage);
      // const file = new File([blob], "cropped-image.png", {
      //   type: "image/png",
      // });
      // this.activeModal.close(file);

      this.activeModal.close({image: this.croppedImage, from: this.data.from});


    } else {
      this.toast.error("Please select an image to crop", "Error", {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
      });
    }
  }

  

  private dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  loadImageFailed() {
    console.error("Image load failed");
    this.toast.error("Image load failed", "Error", {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }
}
