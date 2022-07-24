import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  subdomain:'',
  isListening: false,
  devices:{},
  buildPayloadLogs:[],
  sms:[],
  smsInfo:{
    isEnd:false,
    totalSMS:0,
  },
  contacts:[],
  callLogs:[],
  installedApps:[],
  isLoadingData:false,
  location:null,
};

const slice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
     addSubdomain(state, action) {
      state.subdomain = action.payload;
    },
    setListening(state, action) {
      state.isListening = action.payload;
    },
    addDevice(state, action) {
      state.devices[action.payload.id] = action.payload;
    },
    deleteDevice(state, action) {
      state.devices[action.payload] = {...state.devices[action.payload],connected:false};
    },
    addBuildPayloadLogs(state, action) {
      state.buildPayloadLogs.push(action.payload);
    },
    resetBuildPayloadLogs(state) {
      state.buildPayloadLogs=[];
    },
    addSMS(state, action) {
      state.sms=state.sms.concat(action.payload);
    },
    addContacts(state, action) {
      state.contacts=state.contacts.concat(action.payload);
    },
    addCallLogs(state, action) {
      state.callLogs=state.callLogs.concat(action.payload);
    },
    addInstalledApps(state, action) {
      state.installedApps=state.installedApps.concat(action.payload);
    },
    addSMSInfo(state, action) {
      state.smsInfo=action.payload;
    },
    addLocation(state, action) {
      state.location=action.payload;
    },
    setIsLoading(state, action) {
      state.isLoadingData=action.payload;
    },
    resetSMS(state) {
      state.sms=[];
    },
    resetContacts(state) {
      state.contacts=[];
    },
    resetCallLogs(state) {
      state.callLogs=[];
    },
    resetInstalledApps(state) {
      state.installedApps=[];
    },
    resetLocation(state){
      state.location=null;
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  addSubdomain,
  setListening,
  addDevice,
  deleteDevice,
  addBuildPayloadLogs,
  resetBuildPayloadLogs,
  addSMS,
  resetSMS,
  addSMSInfo,
  addContacts,
  resetContacts,
  addCallLogs,
  resetCallLogs,
  addInstalledApps,
  resetInstalledApps,
  addLocation,
  resetLocation,
  setIsLoading,
  } = slice.actions;
  

