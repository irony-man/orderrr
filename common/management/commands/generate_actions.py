# App Imports
from django.conf import settings
from django.core.management import BaseCommand
from loguru import logger


class Command(BaseCommand):
    def handle(self, *args, **options):
        template = """
  async list%(apiTitle)s(query) {
    const url = getUrl("%(name)s");
    return await getRequest(url, query);
  },

  async get%(apiTitle)s(uid) {
    const url = getUrl(`%(name)s/${uid}`);
    return await getRequest(url);
  },

  async create%(apiTitle)s(formData) {
    const url = getUrl("%(name)s");
    return await postRequest(url, formData);
  },

  async update%(apiTitle)s({uid, formData}) {
    const url = getUrl(`%(name)s/${uid}`);
    return await patchRequest(url, formData);
  },

  async createOrUpdate%(apiTitle)s({uid, formData}) {
    return await uid?this.update%(apiTitle)s({uid, formData}):this.create%(apiTitle)s(formData);
  },

  async delete%(apiTitle)s(uid) {
    const url = getUrl(`%(name)s/${uid}`);
    return await deleteRequest(url);
  },

  async createOrDelete%(apiTitle)s({uid, formData}) {
    return await uid?this.delete%(apiTitle)s(uid):this.create%(apiTitle)s(formData);
  },
"""
        result = []
        actions = {
            "user-profile",
            "design",
            "order",
            "cart",
            "wishlist",
            "card",
            "address",
        }
        for name in sorted(actions):
            title = name.replace("-", " ").title().replace(" ", "")
            fmt = template % {"name": name, "apiTitle": title}
            result.append(fmt)
            logger.info(f"Actions generated for {title}.")
        functions = "\n".join(result)
        file_template = (
            """
import {
  getRequest,
  getUrl,
  postRequest,
  patchRequest,
  deleteRequest
} from "./network";

export default {
    %s
};
"""
            % functions
        )
        path = (
            settings.BASE_DIR
            / "client"
            / "src"
            / "redux"
            / "actions"
            / "actions.gen.js"
        )

        with open(path, "w") as fp:
            fp.write(file_template)
            fp.flush()
