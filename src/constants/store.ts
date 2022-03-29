import create, {SetState} from 'zustand';

interface Store {
  user: any;
  setUser: (data: any) => void;
}

const useStore = create<Store>((set: SetState<any>) => ({
  user: {},
  setUser: (data: any) => set({user: data}),
}));

export default useStore;
