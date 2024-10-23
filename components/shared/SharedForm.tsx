import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'time' | 'checkbox' | 'select' | 'textarea' | 'custom';
  options?: { value: string; label: string }[];
  required?: boolean;
  render?: (props: { value: any; onChange: (value: any) => void }) => React.ReactNode;
}

interface SharedFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (formData: Record<string, any>) => void;
  initialData?: Record<string, any>;
  submitButtonText: string;
}

const SharedForm: React.FC<SharedFormProps> = ({ title, fields, onSubmit, initialData, submitButtonText }) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData || {});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setError(`Failed to submit form: ${error.message}`);
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'time':
        return (
          <Input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            id={field.name}
            checked={formData[field.name] || false}
            onCheckedChange={(checked) => handleChange(field.name, checked)}
          />
        );
      case 'select':
        return (
          <Select
            name={field.name}
            value={formData[field.name] || ''}
            onValueChange={(value) => handleChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case 'custom':
        return field.render ? field.render({
          value: formData[field.name],
          onChange: (value) => handleChange(field.name, value)
        }) : null;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {renderField(field)}
            </div>
          ))}
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SharedForm;
