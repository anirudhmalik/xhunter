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
  isLoadingData:true
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
    addSMSInfo(state, action) {
      state.smsInfo=action.payload;
    },
    setIsLoading(state, action) {
      state.isLoadingData=action.payload;
    },
    resetSMS(state) {
      state.sms=[];
    },
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
  setIsLoading
  } = slice.actions;
  

