import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-textiles-manager',
  templateUrl: './textiles-manager.component.html',
  styleUrls: ['./textiles-manager.component.css']
})
export class TextilesManagerComponent implements OnInit {
  cmsForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private cmsService: CmsService) {
    this.cmsForm = this.fb.group({
      title: ['', Validators.required],
      content: [''], // Simple text area for now, could be HTML editor
      slug: ['textiles', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage() {
    this.loading = true;
    this.cmsService.getPage('textiles').subscribe({
      next: (res) => {
        if (res.data) {
          // If structure is { title: ..., content: { body: "..." } }
          // We assume content is just a string or object. Let's handle simple object for now
          // content: { html: "..." }
          const content = res.data.content?.html || '';
          this.cmsForm.patchValue({
            title: res.data.title,
            content: content
          });
        }
        this.loading = false;
      },
      error: (err) => {
        // Page might not exist yet, that's fine
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.cmsForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = this.cmsForm.value;
    // Structure content as object
    const payload = {
      slug: 'textiles',
      title: formData.title,
      content: { html: formData.content }
    };

    this.cmsService.createPage(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'Page updated successfully!';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to update page.';
      }
    });
  }
}
