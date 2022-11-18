import { mapGetters } from 'vuex';
import { ROLES } from '@/utils/constants';
export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  },
  methods: {
    itemRowBackground(item) {
      if (this.allowedRoles([ROLES.ID.admin]) || this.allowedRoles([ROLES.ID.root])) {
        return item.status + ' lighten-5';
      } else {
        if (
          item.need_verification == 1 &&
          !item.user_verifications.find((i) => i.verification_statuses_id == this.user.role_id)
        ) {
          return 'warning lighten-5';
        }
        if (
          item.need_verification == 1 &&
          item.user_verifications.find((i) => i.verification_statuses_id == this.user.role_id && i.status == 0)
        ) {
          return 'error lighten-5';
        }
        if (
          item.need_verification == 1 &&
          item.user_verifications.find((i) => i.verification_statuses_id == this.user.role_id && i.status == 1)
        ) {
          return 'success lighten-5';
        }
      }
    },
  },
};
