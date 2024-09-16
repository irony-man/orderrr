# from functools import wraps

# from django.conf import settings
# from django.core.files.images import ImageFile
# from django.db import transaction
# from django.db.models.signals import post_delete, post_save, pre_save
# from django.dispatch import receiver
# from django.utils import timezone
# from loguru import logger

# from common import new_inventory
# from common.communications import safe_send_email
# from common.inventory import (
#     at_bale,
#     at_batch_lot_input,
#     at_batch_lot_output,
#     at_dispatch_order,
#     at_grn_line_item,
#     at_purchase_bill,
#     at_segregation_out,
#     at_warehouse_transfer_entry,
# )
# from common.model_helpers import attach_qr
# from common.models import (
#     Bale,
#     BaleSet,
#     BatchLotInput,
#     BatchLotOutput,
#     DispatchLineItem,
#     DispatchOrder,
#     EmailReport,
#     GoodsReceiptNote,
#     GrnLineItem,
#     MrfSegregation,
#     MrfSegregationOut,
#     PasswordResetRequest,
#     Production,
#     PurchaseBill,
#     PurchaseOrder,
#     QRCode,
#     QualityControlQuestionnaire,
#     SalesBill,
#     SalesOrder,
#     Segregation,
#     SegregationOut,
#     TradePartnerAddress,
#     WarehouseTransfer,
#     WarehouseTransferEntry,
#     WorkOrder,
# )
# from common.tasks import email_report_dispatch
# from common.taxonomies import EmailReportType, JobStatus
# from orderrr.settings import BASE_URL

# qr_base_url = f"{BASE_URL}/qr-code/"


# @receiver(post_save, sender=SegregationOut)
# def on_segregation_out(sender, instance: SegregationOut, **kwargs):
#     if kwargs["created"]:
#         # at_segregation_out(instance)
#         new_inventory.at_segregation_out_create(instance)


# @receiver(post_save, sender=DispatchLineItem)
# def on_dispatch_order(sender, instance: DispatchLineItem, **kwargs):
#     if kwargs["created"]:
#         # at_dispatch_order(instance)
#         new_inventory.at_dispatch_create(instance)


# @receiver(post_save, sender=Bale)
# def on_bale_created(sender, instance: Bale, created, **kwargs):
#     if created:
#         new_inventory.at_bale_create(instance)
#         # at_bale(instance)


# @receiver(post_save, sender=PasswordResetRequest)
# def on_password_reset_request(
#     sender, instance: PasswordResetRequest, created, *args, **kwargs
# ):
#     if created:
#         reset_url = f"{settings.BASE_URL}{instance.url}"
#         if settings.DEBUG:
#             logger.debug(f"Reset URL: {reset_url}")

#         context = {
#             "resetLink": reset_url,
#             "username": instance.user.get_full_name(),
#         }
#         safe_send_email(
#             "common/email/reset-password",
#             context,
#             "Instructions to reset your SatmaCE password",
#             (instance.user.email,),
#         )
#         # send_mail_postmark(
#         #     context={
#         #         "resetLink": reset_url,
#         #         "username": instance.user.get_full_name(),
#         #     },
#         #     template_alias="password-reset-1",
#         #     subject="Instructions to reset your SatmaCE password",
#         #     to=instance.user.email,
#         # )
#         instance.mail_sent = True
#         instance.mail_sent_at = timezone.now()
#         instance.save()


# @receiver(post_save, sender=EmailReport)
# def on_email_report(sender, instance: EmailReport, *args, **kwargs):
#     if instance.status == JobStatus.OPEN:
#         email_report_dispatch(instance.id)


# def on_transaction_commit(func):
#     def inner(*args, **kwargs):
#         transaction.on_commit(lambda: func(*args, **kwargs))

#     return inner


# @receiver(post_save, sender=QualityControlQuestionnaire)
# @on_transaction_commit
# def on_qc_questionnaire_save(
#     sender, instance: QualityControlQuestionnaire, created, *args, **kwargs
# ):
#     if instance.is_archived:
#         items = instance.items.all()
#         for item in items:
#             other_questionnaires = item.questionnaire_items.exclude(
#                 id=instance.id
#             )
#             if not other_questionnaires.exists():
#                 item.qc_required = False
#                 item.save()
#     else:
#         items = instance.items.all()
#         for item in items:
#             # Retrieve all questionnaires (except current) which are active and not complete
#             other_questionnaires = item.questionnaire_items.filter(
#                 is_active=True,
#             ).exclude(id=instance.id)
#             if not other_questionnaires.exists() and not instance.is_active:
#                 item.qc_required = False
#             if instance.is_active:
#                 item.qc_required = True
#             item.save()


# @receiver(post_save, sender=BatchLotInput)
# def on_batch_lot_input_save(
#     sender, instance: BatchLotInput, created, *args, **kwargs
# ):
#     if created:
#         # at_batch_lot_input(instance)
#         new_inventory.at_batch_lot_input_create(instance)


# @receiver(post_save, sender=BatchLotOutput)
# def on_batch_lot_output_save(
#     sender, instance: BatchLotOutput, created, *args, **kwargs
# ):
#     if created:
#         # at_batch_lot_output(instance)
#         new_inventory.at_batch_lot_output_create(instance)


# @receiver(post_save, sender=WarehouseTransferEntry)
# def on_warehouse_transfer_entry(
#     sender, instance: WarehouseTransferEntry, created, *args, **kwargs
# ):
#     if created:
#         # at_warehouse_transfer_entry(instance)
#         new_inventory.at_warehouse_transfer_entry_create(instance)


# @receiver(post_save, sender=PurchaseBill)
# def on_purchase_bill_save(
#     sender, instance: WarehouseTransferEntry, created, *args, **kwargs
# ):
#     if created:
#         at_purchase_bill(instance)


# @receiver(pre_save, sender=GrnLineItem)
# def on_grn_line_item_save(sender, instance: GrnLineItem, *args, **kwargs):
#     at_grn_line_item(instance)


# @receiver(post_delete, sender=Bale)
# def post_bale_delete(sender, instance: Bale, *args, **kwargs):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=GrnLineItem)
# def post_grn_line_item_delete(sender, instance: GrnLineItem, *args, **kwargs):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=BatchLotOutput)
# def post_batch_lot_output_delete(
#     sender, instance: BatchLotOutput, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=TradePartnerAddress)
# def post_trade_partner_address_delete(
#     sender, instance: TradePartnerAddress, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=GoodsReceiptNote)
# def post_goods_receipt_note_delete(
#     sender, instance: GoodsReceiptNote, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=Segregation)
# def post_segregation_delete(sender, instance: Segregation, *args, **kwargs):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=SegregationOut)
# def post_batch_lot_output_delete(
#     sender, instance: SegregationOut, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=BaleSet)
# def post_bale_set_delete(sender, instance: BaleSet, *args, **kwargs):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=DispatchOrder)
# def post_dispatch_order_delete(
#     sender, instance: DispatchOrder, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=WorkOrder)
# def post_work_order_delete(sender, instance: WorkOrder, *args, **kwargs):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=Production)
# def post_production_delete(sender, instance: Production, *args, **kwargs):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=BatchLotInput)
# def post_batch_lot_input_delete(
#     sender, instance: BatchLotInput, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=PurchaseBill)
# def post_purchase_bill_delete(sender, instance: PurchaseBill, *args, **kwargs):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=SalesBill)
# def post_sales_bill_delete(sender, instance: SalesBill, *args, **kwargs):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=SalesOrder)
# def post_sales_order_delete(sender, instance: SalesOrder, *args, **kwargs):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=WarehouseTransfer)
# def post_sales_order_delete(
#     sender, instance: WarehouseTransfer, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=WarehouseTransferEntry)
# def post_sales_order_delete(
#     sender, instance: WarehouseTransferEntry, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=PurchaseOrder)
# def post_purchase_order_delete(
#     sender, instance: PurchaseOrder, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=MrfSegregation)
# def post_mrf_segregation_delete(
#     sender, instance: MrfSegregation, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()


# @receiver(post_delete, sender=MrfSegregationOut)
# def post_mrf_segregation_out_delete(
#     sender, instance: MrfSegregationOut, *args, **kwargs
# ):
#     if instance.qr_code:
#         instance.qr_code.delete()
