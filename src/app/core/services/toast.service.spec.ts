import { ToastService, Toast } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => { service = new ToastService(); });

  it('should add success toast', () => {
    service.success('OK');
    let toasts: Toast[] = [];
    service.toasts.subscribe(t => toasts = t);
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('OK');
  });

  it('should add error toast', () => {
    service.error('Fail');
    let toasts: Toast[] = [];
    service.toasts.subscribe(t => toasts = t);
    expect(toasts[0].type).toBe('error');
  });

  it('should add info toast', () => {
    service.info('Info');
    let toasts: Toast[] = [];
    service.toasts.subscribe(t => toasts = t);
    expect(toasts[0].type).toBe('info');
  });

  it('should dismiss toast', () => {
    service.success('A');
    let toasts: Toast[] = [];
    service.toasts.subscribe(t => toasts = t);
    const id = toasts[0].id;
    service.dismiss(id);
    service.toasts.subscribe(t => toasts = t);
    expect(toasts.length).toBe(0);
  });
});
