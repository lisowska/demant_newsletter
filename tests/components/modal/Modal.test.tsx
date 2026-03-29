import Modal from 'components/modal/Modal';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

jest.mock('components/modal/PortalRootLoader', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('Modal', () => {
  it('does not render dialog when closed', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <p>Modal body</p>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog with title reference when open', async () => {
    render(
      <Modal isOpen onClose={jest.fn()} titleId="modal-title-for-test">
        <h2 id="modal-title-for-test">Headline</h2>
        <p>Modal body</p>
      </Modal>
    );

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAccessibleName('Headline');
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <span id="newsletter-modal-title">Title</span>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /close dialog/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape when open', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <span id="newsletter-modal-title">Title</span>
      </Modal>
    );

    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
