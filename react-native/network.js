import { NetInfo } from "react-native"

export class ReactNativeNetworkStatus {
    onStatusChangeListener(callback) {
        const listener = (connected) => {
            callback.onStatusChange({ online: connected })
        };
        NetInfo.isConnected.addEventListener('connectionChange', listener)
    }

    async isOffline() {
        const isConnected = await NetInfo.isConnected.fetch()
        return !isConnected
    }
}
