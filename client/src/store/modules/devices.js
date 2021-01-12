import {api} from "@/helpers/api";

const state = {
    devices: null,
}

const mutations = {
    setDevices: (state, payload) => {
        state.devices = payload
    }
}

const actions = {
    getAllDevices: async (context) => {
        await api.get('/devices')
            .then(response => {
                context.commit('setDevices', response.data.data.Items)
            })
            .catch(error => {
                console.log("error", error);
            });
    }
}

const getters = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
