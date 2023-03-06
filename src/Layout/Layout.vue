<script lang="ts">
import { h } from "vue";

import Classic from "@/Layout/Classic.vue";
import TopLeft from "@/Layout/TopLeft.vue";
import Top from "@/Layout/Top.vue";
import appStore from "@/store/index";

export default {
    setup() {
        const { configState } = appStore.configStore
        return () => {
            if (configState.layoutType == "classic") {
                return h(Classic)
            } else if (configState.layoutType == "top-left") {
                return h(TopLeft)
            } else if (configState.layoutType == "top") {
                return h(Top)
            }
        }
    }
}
</script>