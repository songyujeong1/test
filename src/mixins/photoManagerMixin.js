export const photoManagerMixin = {
  props: {
    facilityNo: {
      required: true,
      default: null
    },
    roomNo: {
      required: false,
      default: null
    },
    roomName: {
      required: false,
      default: null
    }
  },
  data() {
    return {
      categorys: null,
      photoTypes: null,
      category: null,
      roomInfo: null,
      allPhotos: null,
      photos: null
    };
  },
  methods: {
    async getPhotos(facilityNo) {
      await this.httpGet(`/api/facilityMng/facilityPhoto/${facilityNo}`).then(
        result => {
          this.allPhotos = result.data;

          for (let i = 0; i < this.allPhotos.length; i++) {
            this.allPhotos[i].delYn = 'N';
          }
        }
      );

      this.onPhotoSort('Y', !this.isEmpty(this.category));
    },
    async getRoomPhotos() {
      await this.httpGet(`/api/roomMng/roomPhoto/${this.facilityNo}?roomNo=${this.roomNo}`).then(
        result => {
          this.allPhotos = result.data;

          for (let i = 0; i < this.allPhotos.length; i++) {
            this.allPhotos[i].delYn = 'N';
          }
        }
      );

      this.onPhotoSort('N', false);
    },
    onUploadPhoto(isIonicPhoto, photoInfo, event) {
      if (this.isEmpty(photoInfo)) {
        if (isIonicPhoto === 'Y') {
          const file = event.srcElement.files[0];
          const url = window.URL.createObjectURL(new Blob([file]));
          const fileInfo = {
            photoNo: (isIonicPhoto && this.allPhotos.findIndex(x => x.isIonicPhoto === 'Y') > -1) ? this.allPhotos[0].photoNo : null,
            facilityNo: this.facilityNo,
            roomNo: this.roomNo,
            isIonicPhoto: 'Y',
            seq: url.split('/')[url.split('/').length - 1],
            file: file,
            description: file.name,
            fileSize: file.size,
            url: url,
            delYn: 'N'
          };

          this.allPhotos.splice(0, 1, fileInfo);
        } else {
          for (let i = 0; i < event.srcElement.files.length; i++ ) {
            const file = event.srcElement.files[i];
            const url = window.URL.createObjectURL(new Blob([file]));

            this.allPhotos.push(
              {
                facilityNo: this.facilityNo,
                roomNo: this.roomNo,
                isIonicPhoto: 'N',
                photoType: this.isEmpty(this.category) ? '' : this.category,
                seq: url.split('/')[url.split('/').length - 1],
                file: file,
                description: file.name,
                fileSize: file.size,
                url: url,
                delYn: 'N'
              }
            );
          }
        }
      } else {
        const file = event.srcElement.files[0];
        const url = window.URL.createObjectURL(new Blob([file]));
        let index = this.isEmpty(photoInfo.photoNo) ? this.allPhotos.findIndex(x => x.seq === photoInfo.seq) : this.allPhotos.findIndex(x => x.photoNo === photoInfo.photoNo);

        this.allPhotos[index].seq = url.split('/')[url.split('/').length - 1];
        this.allPhotos[index].file = file;
        this.allPhotos[index].description = file.name;
        this.allPhotos[index].fileSize = file.size;
        this.allPhotos[index].url = url;
      }

      if (this.isEmpty(this.category)) {
        this.onPhotoSort('N', false);
      } else {
        this.onPhotoSort('Y', !this.isEmpty(this.category));
      }
    },
    onPhotoDelete(photoInfo) {
      messageBox.show('', '사진을 삭제 하시겠습니까?', 'YesNo', 'warning').then(
        (result) => {
          if (result === 'yes') {
            // let index = null;

            // if (this.isEmpty(photoInfo.photoNo)) {
            //   index = this.allPhotos.findIndex(x => x.seq === photoInfo.seq);
            // } else {
            //   index = this.allPhotos.findIndex(x => x.photoNo === photoInfo.photoNo);
            // }

            // this.allPhotos[index].delYn = 'Y';
            // this.photos = this.allPhotos.filterBy(x => x.delYn, 'N');
            this.httpDelete(`/api/roomMng/photo/${photoInfo.photoNo}`).then(result => {
              messageBox.show('', '삭제되었습니다.');
              this.onRetrieve();
            });
          }
        }
      );
    },
    onCategoryChanged() {
      this.onPhotoSort('Y', !this.isEmpty(this.category));
    },
    onPhotoSort(photoTypeYn, isCategory) {
      let tmp = this.allPhotos;

      if (isCategory && this.category !== 'ALL') {
        tmp = this.allPhotos.filterBy(x => x.photoType, this.category);
      } else {
        tmp = this.allPhotos;
      }

      if (photoTypeYn === 'Y') {
        this.photos = tmp.sort(
          this.compareBy(
            {
              name: 'isIonicPhoto',
              reverse: true
            },
            {
              name: 'photoType',
              primer: parseInt,
              reverse: false
            },
            {
              name: 'photoNo',
              primer: parseInt,
              reverse: false
            }
          )
        );
      } else {
        this.photos = tmp.sort(
          this.compareBy(
            {
              name: 'isIonicPhoto',
              reverse: true
            },
            {
              name: 'photoNo',
              primer: parseInt,
              reverse: false
            }
          )
        );
      }

      this.photos = tmp.filterBy(x => x.delYn, 'N');
    }
  }
};
