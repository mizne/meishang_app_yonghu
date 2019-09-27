import {
  Component,
  StaticProvider,
  forwardRef,
  OnDestroy,
  Input,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ESdkObsService } from '../esdk-obs.service';

export const QUILL_EDITOR_WRAPPER_VALUE_ACCESSOR: StaticProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QuillEditorWrapperComponent),
  multi: true
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-quill-editor-wrapper',
  templateUrl: './quill-editor-wrapper.component.html',
  providers: [QUILL_EDITOR_WRAPPER_VALUE_ACCESSOR]
})
export class QuillEditorWrapperComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  public editor;
  loading = false;

  private onChange: Function;
  private destroySubject = new Subject<void>();

  @Input() placeholder = '请输入';
  @Input() readOnly = false;
  @Input() required = false;
  @Input()
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['image', 'video'] // link and image, video
    ]
  };

  formControl = new FormControl(
    null,
    this.required ? [Validators.required] : []
  );

  constructor(private cosService: ESdkObsService) {}

  ngOnInit() {
    this.formControl.valueChanges
      .pipe(takeUntil(this.destroySubject.asObservable()))
      .subscribe(content => {
        this.onChange(this.replaceBlankSpace(content));
      });
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  editorCreated(quill) {
    const toolbar = quill.getModule('toolbar');
    this.editor = quill;
    if (toolbar) {
      toolbar.addHandler('image', this.imageHandler.bind(this));
      toolbar.addHandler('video', this.videoHandler.bind(this));
    }
  }

  imageHandler() {
    const imageinput = document.createElement('input');
    imageinput.setAttribute('type', 'file');
    imageinput.setAttribute('accept', 'image/*');
    imageinput.classList.add('ql-image');
    imageinput.addEventListener('change', () => {
      const file = imageinput.files[0];
      this.loading = true;
      this.cosService.uploadFile(file).subscribe(
        loc => {
          if (typeof loc === 'string') {
            this.loading = false;
            const range = this.editor.getSelection(true);
            const index = range.index + range.length;
            this.editor.insertEmbed(range.index, 'image', loc);
          }
        },
        () => {
          this.loading = false;
          // this.notify.error(`上传图片失败，请稍候重试！`);
        }
      );
    });
    imageinput.click();
  }

  videoHandler() {
    const videoInput = document.createElement('input');
    videoInput.setAttribute('type', 'file');
    videoInput.setAttribute('accept', 'video/*');
    videoInput.classList.add('ql-video');
    videoInput.addEventListener('change', () => {
      const file = videoInput.files[0];
      this.loading = true;
      this.cosService.uploadFile(file).subscribe(
        loc => {
          if (typeof loc === 'string') {
            this.loading = false;
            const range = this.editor.getSelection(true);
            const index = range.index + range.length;
            this.editor.insertEmbed(range.index, 'video', loc);
          }
        },
        () => {
          this.loading = false;
          // this.notify.error(`上传视频失败，请稍候重试！`);
        }
      );
    });
    videoInput.click();
  }

  writeValue(content: string): void {
    if (content) {
      this.formControl.patchValue(content, { emitEvent: false });
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    // noop
  }
  setDisabledState?(isDisabled: boolean): void {
    // noop
  }

  private replaceBlankSpace(srcText: string): string {
    // 保证只替换html标签间空格，防止html标签内空格被替换
    // 只替换p标签间文本空格 不替换src属性前空格
    // <p> 123  </p><img src="example.com">
    return srcText ? srcText.replace(/\s{2}/g, '&nbsp;&nbsp;') : '';
  }
}
