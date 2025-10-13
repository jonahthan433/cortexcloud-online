import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadCaptureBuilder } from '../LeadCaptureBuilder';

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('LeadCaptureBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render lead capture builder', () => {
    render(<LeadCaptureBuilder />);

    expect(screen.getByText('Lead Capture Form Builder')).toBeInTheDocument();
    expect(screen.getByText('Form Preview')).toBeInTheDocument();
    expect(screen.getByText('Form Code')).toBeInTheDocument();
  });

  it('should add new field', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);

    // Should show field type selector
    expect(screen.getByText('Select Field Type')).toBeInTheDocument();
  });

  it('should update form title', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    const titleInput = screen.getByPlaceholderText('Enter form title');
    await user.clear(titleInput);
    await user.type(titleInput, 'New Form Title');

    expect(titleInput).toHaveValue('New Form Title');
  });

  it('should update form description', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    const descriptionInput = screen.getByPlaceholderText('Enter description');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'New form description');

    expect(descriptionInput).toHaveValue('New form description');
  });

  it('should add text field', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);

    const textFieldOption = screen.getByText('Text Input');
    await user.click(textFieldOption);

    // Should add a new text field
    expect(screen.getByText('Text Field')).toBeInTheDocument();
  });

  it('should add email field', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);

    const emailFieldOption = screen.getByText('Email');
    await user.click(emailFieldOption);

    // Should add a new email field
    expect(screen.getByText('Email Field')).toBeInTheDocument();
  });

  it('should add phone field', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);

    const phoneFieldOption = screen.getByText('Phone');
    await user.click(phoneFieldOption);

    // Should add a new phone field
    expect(screen.getByText('Phone Field')).toBeInTheDocument();
  });

  it('should add textarea field', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);

    const textareaFieldOption = screen.getByText('Textarea');
    await user.click(textareaFieldOption);

    // Should add a new textarea field
    expect(screen.getByText('Textarea Field')).toBeInTheDocument();
  });

  it('should update field label', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    // Add a field first
    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);
    await user.click(screen.getByText('Text Input'));

    // Find the label input for the new field
    const labelInputs = screen.getAllByPlaceholderText('Field label');
    const newFieldLabelInput = labelInputs[labelInputs.length - 1];
    
    await user.clear(newFieldLabelInput);
    await user.type(newFieldLabelInput, 'Custom Label');

    expect(newFieldLabelInput).toHaveValue('Custom Label');
  });

  it('should update field placeholder', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    // Add a field first
    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);
    await user.click(screen.getByText('Text Input'));

    // Find the placeholder input for the new field
    const placeholderInputs = screen.getAllByPlaceholderText('Placeholder text');
    const newFieldPlaceholderInput = placeholderInputs[placeholderInputs.length - 1];
    
    await user.clear(newFieldPlaceholderInput);
    await user.type(newFieldPlaceholderInput, 'Custom placeholder');

    expect(newFieldPlaceholderInput).toHaveValue('Custom placeholder');
  });

  it('should toggle field required status', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    // Add a field first
    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);
    await user.click(screen.getByText('Text Input'));

    // Find the required toggle for the new field
    const requiredToggles = screen.getAllByRole('switch');
    const newFieldRequiredToggle = requiredToggles[requiredToggles.length - 1];
    
    expect(newFieldRequiredToggle).not.toBeChecked();
    
    await user.click(newFieldRequiredToggle);
    
    expect(newFieldRequiredToggle).toBeChecked();
  });

  it('should remove field', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    // Add a field first
    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);
    await user.click(screen.getByText('Text Input'));

    // Should have the new field
    expect(screen.getByText('Text Field')).toBeInTheDocument();

    // Remove the field
    const removeButtons = screen.getAllByText('Remove');
    const newFieldRemoveButton = removeButtons[removeButtons.length - 1];
    await user.click(newFieldRemoveButton);

    // Field should be removed
    expect(screen.queryByText('Text Field')).not.toBeInTheDocument();
  });

  it('should copy form code to clipboard', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    const copyButton = screen.getByText('Copy Code');
    await user.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it('should handle clipboard error gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock clipboard error
    (navigator.clipboard.writeText as any).mockRejectedValue(new Error('Clipboard error'));

    render(<LeadCaptureBuilder />);

    const copyButton = screen.getByText('Copy Code');
    await user.click(copyButton);

    // Should handle error gracefully (no crash)
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it('should generate valid HTML code', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    // Update form title
    const titleInput = screen.getByPlaceholderText('Enter form title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Test Form');

    // Add a text field
    const addFieldButton = screen.getByText('Add Field');
    await user.click(addFieldButton);
    await user.click(screen.getByText('Text Input'));

    // Check that the generated code contains the form title
    const codeTextarea = screen.getByDisplayValue(/Test Form/);
    expect(codeTextarea).toBeInTheDocument();
  });

  it('should show form preview', () => {
    render(<LeadCaptureBuilder />);

    // Should show preview section
    expect(screen.getByText('Form Preview')).toBeInTheDocument();
    
    // Should show default form elements
    expect(screen.getByText('Contact Form')).toBeInTheDocument();
    expect(screen.getByText('Get in touch with us')).toBeInTheDocument();
  });

  it('should update preview when form changes', async () => {
    const user = userEvent.setup();
    
    render(<LeadCaptureBuilder />);

    // Update form title
    const titleInput = screen.getByPlaceholderText('Enter form title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');

    // Preview should update
    expect(screen.getByText('Updated Title')).toBeInTheDocument();
  });
});
