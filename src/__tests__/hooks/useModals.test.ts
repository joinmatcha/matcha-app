import { act, renderHook } from '@testing-library/react-native';

import { useModal } from '@/hooks/useModals';

describe('useModal', () => {
  it('initialise visible à false par défaut', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.visible).toBe(false);
  });

  it('initialise visible à true si initialState = true', () => {
    const { result } = renderHook(() => useModal(true));
    expect(result.current.visible).toBe(true);
  });

  it('show() passe visible à true', () => {
    const { result } = renderHook(() => useModal());
    act(() => result.current.show());
    expect(result.current.visible).toBe(true);
  });

  it('hide() passe visible à false', () => {
    const { result } = renderHook(() => useModal(true));
    act(() => result.current.hide());
    expect(result.current.visible).toBe(false);
  });

  it('toggle() inverse la valeur courante', () => {
    const { result } = renderHook(() => useModal());
    act(() => result.current.toggle());
    expect(result.current.visible).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.visible).toBe(false);
  });
});
