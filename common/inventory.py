# from django.db import transaction
# from django.db.models import ExpressionWrapper, F, FloatField, Sum
# from django.db.models.functions import Coalesce
# from loguru import logger
# from rest_framework.exceptions import ValidationError

# from common.model_helpers import random_alphanum
# from common.models import (
#     Bale,
#     BaleInventoryCommitment,
#     BaleSet,
#     Batch,
#     BatchLot,
#     BatchLotInput,
#     BatchLotOutput,
#     DispatchLineItem,
#     DispatchOrder,
#     GoodsReceiptNote,
#     GrnLineItem,
#     InventoryRecord,
#     Production,
#     PurchaseBill,
#     PurchaseOrderItem,
#     QualityControlTransaction,
#     Segregation,
#     SegregationOut,
#     SegregationUsedInBale,
#     WarehouseTransfer,
#     WarehouseTransferEntry,
# )
# from common.taxonomies import (
#     InventoryMode,
#     LotInputType,
#     QuestionnaireType,
#     Status,
#     WarehouseTransferEntryInputType,
# )


# def ensure_approved(func):
#     def __inner(instance):
#         if hasattr(instance, "is_approved") and not instance.is_approved:
#             logger.warning(
#                 f"Attempt to create Inventory from {instance.__class__} "
#                 f"[{instance}] which is not approved."
#             )
#             return
#         func(instance)

#     return __inner


# @ensure_approved
# def from_grn_inward(grn: GoodsReceiptNote):
#     with transaction.atomic():
#         for line_item in grn.grnlineitem_set.all():
#             if not line_item.inventory_record:
#                 record = InventoryRecord.new_inventory(
#                     warehouse=grn.warehouse,
#                     item=line_item.item,
#                     unit_category=line_item.unit.category,
#                     packaging=line_item.packaging,
#                     quality_checked=False,
#                     quantity=line_item.net_quantity,
#                 )
#                 line_item.inventory_record = record
#                 line_item.save()


# def at_segregation_out(instance: SegregationOut):
#     segregation = instance.segregation_source.segregation
#     source_document = instance.segregation_source.source_document
#     commitment = InventoryRecord.commit_inventory(
#         warehouse=segregation.warehouse,
#         item=source_document.item,
#         unit_category=source_document.unit.category,
#         packaging=source_document.packaging,
#         quality_checked=source_document.qc_approved or False,
#         quantity=instance.quantity,
#     )
#     InventoryRecord.expect_inventory(
#         commit_id=commitment.commit_id,
#         item=instance.item,
#         unit_category=instance.unit.category,
#         packaging=instance.packaging,
#         quality_checked=False,
#     )
#     instance.inventory_record = commitment
#     instance.save()


# @ensure_approved
# def from_segregation(instance: Segregation):
#     with transaction.atomic():
#         for source in instance.segregationsource_set.all():
#             for out_obj in source.segregationout_set.all():
#                 if record := out_obj.inventory_record:
#                     if not record.inventoryrecord_set.exists():
#                         InventoryRecord.fulfill_commitment(
#                             record.commit_id, out_obj.qc_approved
#                         )


# def at_bale(instance: Bale):
#     quality_checked = instance.bale_set.qc_approved
#     ordering = "segregation_source__segregation__approve_datetime"
#     machine = instance.bale_set.machine
#     if machine and machine.account_method == InventoryMode.LIFO:
#         ordering = "-segregation_source__segregation__approve_datetime"

#     queryset = (
#         SegregationOut.objects.annotate(
#             cons_quantity=Coalesce(Sum("segregationusedinbale__quantity"), 0.0)
#         )
#         .filter(
#             cons_quantity__gte=0,
#             segregation_source__segregation__status=Status.APPROVED,
#             item=instance.bale_set.item,
#             unit__category=instance.bale_set.unit.category,
#             packaging=instance.bale_set.source_packaging,
#             warehouse=instance.bale_set.warehouse,
#             qc_approved=instance.bale_set.quality_checked,
#         )
#         .order_by(ordering)
#         .annotate(balance_quantity=F("quantity") - F("cons_quantity"))
#     )
#     if not queryset.exists():
#         raise ValidationError(
#             {
#                 "quantity": (
#                     "Not enough approved and segregated quantity available."
#                 )
#             }
#         )

#     quantity_to_allocate = instance.net_weight
#     for seg_out in queryset:
#         if quantity_to_allocate == 0:
#             break
#         if quantity_to_allocate >= seg_out.balance_quantity:
#             applied_quantity = seg_out.balance_quantity
#         else:
#             applied_quantity = quantity_to_allocate

#         quantity_to_allocate -= applied_quantity
#         if quantity_to_allocate < 0:
#             raise ValidationError(
#                 {
#                     "quantity": (
#                         "Not enough approved and segregated quantity "
#                         "available (QTA < 0)."
#                     )
#                 }
#             )

#         commitment = InventoryRecord.commit_inventory(
#             warehouse=seg_out.warehouse,
#             item=seg_out.item,
#             unit_category=seg_out.unit.category,
#             packaging=seg_out.packaging,
#             quality_checked=seg_out.qc_approved,
#             quantity=applied_quantity,
#         )
#         InventoryRecord.expect_inventory(
#             commit_id=commitment.commit_id,
#             item=instance.bale_set.item,
#             unit_category=instance.bale_set.unit.category,
#             packaging=instance.bale_set.dest_packaging,
#             quality_checked=quality_checked,
#         )
#         BaleInventoryCommitment.objects.create(
#             bale=instance, inventory_record=commitment
#         )
#         SegregationUsedInBale.objects.create(
#             bale=instance,
#             segregation_out=seg_out,
#             quantity=applied_quantity,
#         )


# @ensure_approved
# def from_bale_set(instance: BaleSet):
#     for bale in instance.bale_set.all():
#         for entry in bale.baleinventorycommitment_set.all():
#             InventoryRecord.fulfill_commitment(
#                 entry.inventory_record.commit_id, instance.qc_approved
#             )


# def at_dispatch_order(instance: DispatchLineItem):
#     # Add entry here to log bale usage
#     commit = InventoryRecord.commit_inventory(
#         warehouse=instance.dispatch_order.warehouse,
#         item=instance.item,
#         unit_category=instance.unit.category,
#         packaging=instance.packaging,
#         quality_checked=False,
#         quantity=instance.quantity,
#     )

#     instance.inventory_record = commit
#     instance.save()


# @ensure_approved
# def from_dispatch_order(instance: DispatchOrder):
#     for line_item in instance.dispatchlineitem_set.all():
#         if record := line_item.inventory_record:
#             InventoryRecord.fulfill_commitment(record.commit_id)


# def at_segregation_delete(instance: Segregation):
#     for segregation_source in instance.segregationsource_set.all():
#         for segregation_out in segregation_source.segregationout_set.all():
#             at_segregation_out_delete(segregation_out)


# def at_segregation_out_delete(instance: SegregationOut):
#     if record := instance.inventory_record:
#         with transaction.atomic():
#             instance.inventory_record = None
#             instance.save()
#             InventoryRecord.reverse_commitment(record.commit_id)


# def at_bale_set_delete(instance: BaleSet):
#     for bale in instance.bale_set.all():
#         at_bale_delete(bale)


# def at_bale_delete(instance: Bale):
#     for entry in instance.baleinventorycommitment_set.all():
#         commit_id = entry.inventory_record.commit_id
#         entry.delete()
#         InventoryRecord.reverse_commitment(commit_id)
#     for entry in instance.segregationusedinbale_set.all():
#         entry.delete()


# def at_dispatch_order_delete(instance: DispatchOrder):
#     for dispatch_line_item in instance.dispatchlineitem_set.all():
#         at_dispatch_line_item_delete(dispatch_line_item)


# def at_dispatch_line_item_delete(instance: DispatchLineItem):
#     if record := instance.inventory_record:
#         instance.inventory_record = None
#         instance.save()
#         InventoryRecord.reverse_commitment(record.commit_id)


# @ensure_approved
# def from_qc_transaction(instance: QualityControlTransaction):
#     if not instance.final_decision:
#         # Verify
#         logger.warning("QC Transaction final decision is False")
#         return

#     questionnaire = instance.questionnaire
#     questionnaire.save()

#     if instance.qc_type == QuestionnaireType.GRN:
#         transaction_grn_line_item = instance.transaction_grn_line_item
#         transaction_grn_line_item.qc_approved = True
#         transaction_grn_line_item.save()
#         grn = transaction_grn_line_item.goods_receipt_note
#         commit_id = transaction_grn_line_item.inventory_record.commit_id
#         # Add a negative quantity entry for QC = False
#         InventoryRecord.new_inventory(
#             warehouse=grn.warehouse,
#             packaging=transaction_grn_line_item.packaging,
#             item=transaction_grn_line_item.item,
#             unit_category=transaction_grn_line_item.unit.category,
#             quality_checked=False,
#             quantity=-transaction_grn_line_item.net_quantity,
#             commit_id=commit_id,
#         )

#         # Add positive quantity entry for QC = True
#         InventoryRecord.new_inventory(
#             warehouse=grn.warehouse,
#             packaging=transaction_grn_line_item.packaging,
#             item=transaction_grn_line_item.item,
#             unit_category=transaction_grn_line_item.unit.category,
#             quality_checked=True,
#             quantity=transaction_grn_line_item.net_quantity,
#             commit_id=commit_id,
#         )

#     elif instance.qc_type == QuestionnaireType.SEGREGATION:
#         transaction_segregation_out: SegregationOut = (
#             instance.transaction_segregation_out
#         )
#         transaction_segregation_out.qc_approved = True
#         transaction_segregation_out.save()

#     elif instance.qc_type == QuestionnaireType.BALING:
#         transaction_baleset: BaleSet = instance.transaction_baleset
#         transaction_baleset.qc_approved = True
#         transaction_baleset.save()

#     elif instance.qc_type == QuestionnaireType.PRODUCTION_BATCH:
#         transaction_batch = instance.transaction_batch
#         transaction_batch.qc_approved = True
#         transaction_batch.save()


# def consume_bale_in_lot_input(instance: BatchLotInput, commit_id):
#     batch_lot = instance.batch_lot
#     # ordering = "bale_set__approve_datetime"
#     # machine = instance.batch_lot.batch.machine
#     # if machine and machine.account_method == InventoryMode.LIFO:
#     #     ordering = "-bale_set__approve_datetime"
#     # queryset = (
#     #     Bale.objects.annotate(
#     #         cons_quantity=Coalesce(
#     #             Sum("baleusedinproductionlotinput__quantity"), 0.0
#     #         )
#     #     )
#     #     .filter(
#     #         cons_quantity__gte=0,
#     #         bale_set__status=Status.APPROVED,
#     #         bale_set__item=instance.item,
#     #         bale_set__unit__category=instance.unit.category,
#     #         bale_set__dest_packaging=instance.packaging,
#     #         bale_set__warehouse=batch_lot.batch.warehouse,
#     #     )
#     #     .order_by(ordering)
#     #     .annotate(balance_quantity=F("net_weight") - F("cons_quantity"))
#     # )
#     # if not queryset.exists():
#     #     raise ValidationError("Not enough inventory")
#     # quantity_to_allocate = instance.consumed_quantity
#     # bale = queryset[0]
#     # if quantity_to_allocate == 0:
#     #     raise ValidationError(
#     #         {"consumed_quantity": "Cannot allocate a quantity of 0"}
#     #     )

#     # if quantity_to_allocate >= bale.balance_quantity:
#     #     applied_quantity = bale.balance_quantity
#     # else:
#     #     applied_quantity = quantity_to_allocate
#     # quantity_to_allocate -= applied_quantity
#     # if quantity_to_allocate < 0:
#     #     raise ValidationError(
#     #         {
#     #             "consumed_quantity": (
#     #                 "Not enough quantity " "available (QTA < 0)."
#     #             )
#     #         }
#     #     )

#     # BaleUsedInProductionLotInput.objects.create(
#     #     bale=bale,
#     #     batch_lot_input=instance,
#     #     quantity=applied_quantity,
#     # )

#     inventory_record = InventoryRecord.commit_inventory(
#         warehouse=batch_lot.batch.warehouse,
#         item=instance.item,
#         packaging=instance.packaging,
#         quality_checked=batch_lot.quality_checked,
#         unit_category=instance.unit.category,
#         quantity=instance.consumed_quantity,
#         commit_id=commit_id,
#     )
#     instance.inventory_record = inventory_record
#     instance.save()


# def consume_lot_output_in_lot_input(instance: BatchLotInput, commit_id):
#     batch_lot = instance.batch_lot
#     # ordering = "batch_lot__batch__production__approve_datetime"
#     # machine = instance.batch_lot.batch.machine
#     # if machine and machine.account_method == InventoryMode.LIFO:
#     #     ordering = "-batch_lot__batch__production__approve_datetime"
#     # queryset = (
#     #     BatchLotOutput.objects.annotate(
#     #         cons_quantity=Coalesce(
#     #             Sum("productionlotoutputusedinproductionlotinput__quantity"),
#     #             0.0,
#     #         )
#     #     )
#     #     .filter(
#     #         cons_quantity__gte=0,
#     #         batch_lot__batch__production__status=Status.APPROVED,
#     #         item=instance.item,
#     #         unit__category=instance.unit.category,
#     #         packaging=instance.packaging,
#     #         batch_lot__batch__warehouse=batch_lot.batch.warehouse,
#     #     )
#     #     .order_by(ordering)
#     #     .annotate(balance_quantity=F("quantity") - F("cons_quantity"))
#     # )
#     # if not queryset.exists():
#     #     raise ValidationError("Not enough inventory")
#     # quantity_to_allocate = instance.consumed_quantity
#     # batch_lot_output = queryset[0]
#     # if quantity_to_allocate >= batch_lot_output.balance_quantity:
#     #     applied_quantity = batch_lot_output.balance_quantity
#     # else:
#     #     applied_quantity = quantity_to_allocate

#     # quantity_to_allocate -= applied_quantity
#     # if quantity_to_allocate < 0:
#     #     raise ValidationError({"quantity": ("Not enough quantity")})

#     # ProductionLotOutputUsedInProductionLotInput.objects.create(
#     #     batch_lot_output=batch_lot_output,
#     #     batch_lot_input=instance,
#     #     quantity=applied_quantity,
#     # )

#     inventory_record = InventoryRecord.commit_inventory(
#         warehouse=batch_lot.batch.warehouse,
#         item=instance.item,
#         packaging=instance.packaging,
#         quality_checked=batch_lot.quality_checked,
#         unit_category=instance.unit.category,
#         quantity=instance.consumed_quantity,
#         commit_id=commit_id,
#     )
#     instance.inventory_record = inventory_record
#     instance.save()


# def at_batch_lot_input(instance: BatchLotInput):
#     if not instance.consumed_quantity or instance.consumed_quantity <= 0:
#         raise ValidationError(
#             {"gross_weight_quantity": "Net Weight Quantity cannot be <= 0"}
#         )

#     batch_lot: BatchLot = instance.batch_lot
#     commit_id = None
#     for batch_lot_input in batch_lot.batchlotinput_set.all():
#         if batch_lot_input.inventory_record:
#             commit_id = batch_lot_input.inventory_record.commit_id
#             break
#     for batch_lot_output in batch_lot.batchlotoutput_set.all():
#         if batch_lot_output.inventory_record:
#             commit_id = batch_lot_output.inventory_record.commit_id
#             break
#     # Handle Input types
#     if instance.input_type == LotInputType.NONE:
#         commitment = InventoryRecord.commit_inventory(
#             item=instance.item,
#             packaging=instance.packaging,
#             warehouse=instance.batch_lot.batch.warehouse,
#             unit_category=instance.unit.category,
#             quality_checked=batch_lot.quality_checked,
#             quantity=instance.consumed_quantity,
#             commit_id=commit_id,
#         )
#         instance.inventory_record = commitment
#         instance.save()
#     elif instance.input_type == LotInputType.BALE:
#         consume_bale_in_lot_input(instance, commit_id)
#     elif instance.input_type == LotInputType.LOT_OUTPUT:
#         consume_lot_output_in_lot_input(instance, commit_id)


# def at_batch_lot_output(instance: BatchLotOutput):
#     if not instance.net_weight_quantity or instance.net_weight_quantity <= 0:
#         raise ValidationError(
#             {"gross_weight_quantity": "Net Weight Quantity cannot be <= 0"}
#         )
#     batch_lot = instance.batch_lot
#     commit_id = None
#     for batch_lot_input in batch_lot.batchlotinput_set.all():
#         if batch_lot_input.inventory_record:
#             commit_id = batch_lot_input.inventory_record.commit_id
#             break
#     for batch_lot_output in batch_lot.batchlotoutput_set.all():
#         if batch_lot_output.inventory_record:
#             commit_id = batch_lot_output.inventory_record.commit_id
#             break
#     if not commit_id:
#         commit_id = random_alphanum(size=32, mix_case=True)
#     commitment = InventoryRecord.expect_inventory(
#         commit_id=commit_id,
#         item=instance.item,
#         unit_category=instance.unit.category,
#         packaging=instance.packaging,
#         quality_checked=False,
#         expected_quantity=instance.net_weight_quantity,
#         warehouse=batch_lot.batch.warehouse,
#     )
#     instance.inventory_record = commitment
#     instance.save()


# def at_batch_lot_input_delete(instance: BatchLotInput):
#     for bale_log in instance.baleusedinproductionlotinput_set.all():
#         bale_log.delete()

#     for (
#         lotoutput_log
#     ) in instance.productionlotoutputusedinproductionlotinput_set.all():
#         lotoutput_log.delete()

#     if record := instance.inventory_record:
#         instance.inventory_record = None
#         instance.save()
#         record.delete()


# def at_batch_lot_output_delete(instance: BatchLotOutput):
#     if record := instance.inventory_record:
#         instance.inventory_record = None
#         instance.save()
#         record.delete()


# def at_batch_lot_delete(instance: BatchLot):
#     for batch_lot_input in instance.batchlotinput_set.all():
#         at_batch_lot_input_delete(batch_lot_input)
#         batch_lot_input.delete()
#     for batch_lot_output in instance.batchlotoutput_set.all():
#         at_batch_lot_output_delete(batch_lot_output)
#         batch_lot_output.delete()


# def at_production_delete(instance: Production):
#     for batch in instance.batch_set.all():
#         at_batch_delete(batch)
#         batch.delete()


# def at_batch_delete(instance: Batch):
#     batch_lot: BatchLot
#     for batch_lot in instance.batchlot_set.all():
#         at_batch_lot_delete(batch_lot)
#         batch_lot.delete()


# @ensure_approved
# def from_production(instance: Production):
#     batch: Batch
#     for batch in instance.batch_set.all():
#         batch_lot: BatchLot
#         for batch_lot in batch.batchlot_set.all():
#             commit_ids = set()
#             batch_lot_input: BatchLotInput
#             for batch_lot_input in batch_lot.batchlotinput_set.all():
#                 if batch_lot_input.inventory_record:
#                     commit_ids.add(batch_lot_input.inventory_record.commit_id)
#             for batch_lot_output in batch_lot.batchlotoutput_set.all():
#                 if batch_lot_output.inventory_record:
#                     commit_ids.add(batch_lot_output.inventory_record.commit_id)
#             for commit_id in commit_ids:
#                 InventoryRecord.fulfill_commitment(
#                     commit_id,
#                     quality_checked=batch.qc_approved,
#                 )


# @ensure_approved
# def from_warehouse_transfer(instance: WarehouseTransfer):
#     for entry in instance.warehousetransferentry_set.all():
#         if record := entry.inventory_record:
#             InventoryRecord.fulfill_commitment(
#                 record.commit_id, quality_checked=instance.quality_checked
#             )


# # def consume_bale_in_warehouse_tranfer_entry(instance: WarehouseTransferEntry):
# #     warehouse_transfer = instance.warehouse_transfer
# #     ordering = "bale_set__approve_datetime"
# #     queryset = (
# #         Bale.objects.annotate(
# #             cons_quantity=Coalesce(
# #                 Sum("baleusedinwarehousetransferentry__quantity"), 0.0
# #             )
# #         )
# #         .filter(
# #             cons_quantity__gte=0,
# #             bale_set__status=Status.APPROVED,
# #             bale_set__item=instance.item,
# #             bale_set__unit__category=instance.unit.category,
# #             bale_set__dest_packaging=instance.packaging,
# #             bale_set__warehouse=batch_lot.batch.warehouse,
# #         )
# #         .order_by(ordering)
# #         .annotate(balance_quantity=F("net_weight") - F("cons_quantity"))
# #     )
# #     if not queryset.exists():
# #         raise ValidationError("Not enough inventory")
# #     quantity_to_allocate = instance.consumed_quantity
# #     bale = queryset[0]
# #     if quantity_to_allocate == 0:
# #         raise ValidationError(
# #             {"consumed_quantity": "Cannot allocate a quantity of 0"}
# #         )

# #     if quantity_to_allocate >= bale.balance_quantity:
# #         applied_quantity = bale.balance_quantity
# #     else:
# #         applied_quantity = quantity_to_allocate
# #     quantity_to_allocate -= applied_quantity
# #     if quantity_to_allocate < 0:
# #         raise ValidationError(
# #             {
# #                 "consumed_quantity": (
# #                     "Not enough quantity " "available (QTA < 0)."
# #                 )
# #             }
# #         )

# #     BaleUsedInProductionLotInput.objects.create(
# #         bale=bale,
# #         batch_lot_input=instance,
# #         quantity=applied_quantity,
# #     )

# #     InventoryRecord.commit_inventory(
# #         warehouse=batch_lot.batch.warehouse,
# #         item=instance.item,
# #         packaging=instance.packaging,
# #         quality_checked=True,  # True for now
# #         unit_category=instance.unit.category,
# #         quantity=instance.consumed_quantity,
# #         commit_id=batch_lot.commit_id,
# #     )


# def at_warehouse_transfer_entry_delete(instance: WarehouseTransferEntry):
#     if record := instance.inventory_record:
#         instance.inventory_record = None
#         instance.save()
#         InventoryRecord.reverse_commitment(record.commit_id)


# def at_warehouse_transfer_entry(instance: WarehouseTransferEntry):
#     if not instance.net_quantity or instance.net_quantity <= 0:
#         return
#     warehouse_transfer = instance.warehouse_transfer

#     aggregated_data = InventoryRecord.objects.filter(
#         item=instance.item,
#         packaging=instance.packaging,
#         warehouse=warehouse_transfer.source_warehouse,
#         unit_category=instance.unit.category,
#         quality_checked=warehouse_transfer.quality_checked,
#     ).aggregated_view()
#     if (
#         not aggregated_data
#         or aggregated_data[0].get("total_quantity", 0) < instance.net_quantity
#     ):
#         raise ValidationError({"net_quantity": "Not enough Inventory"})

#     ############### Remove After Traceability is working ###############
#     instance.input_type = WarehouseTransferEntryInputType.NONE
#     ############################################

#     # Handle Input types
#     if instance.input_type == WarehouseTransferEntryInputType.NONE:
#         commitment = InventoryRecord.commit_inventory(
#             item=instance.item,
#             packaging=instance.packaging,
#             warehouse=warehouse_transfer.source_warehouse,
#             unit_category=instance.unit.category,
#             quality_checked=warehouse_transfer.quality_checked,
#             quantity=instance.net_quantity,
#         )
#         # Expect Inventory
#         InventoryRecord.expect_inventory(
#             commit_id=commitment.commit_id,
#             warehouse=warehouse_transfer.dest_warehouse,
#             packaging=instance.packaging,
#             item=instance.item,
#             unit_category=instance.unit.category,
#             quality_checked=warehouse_transfer.quality_checked,
#             expected_quantity=instance.net_quantity,
#         )

#         instance.inventory_record = commitment
#         instance.save()

#     elif instance.input_type == WarehouseTransferEntryInputType.BALE:
#         # consume_bale_in_lot_input(instance)
#         pass
#     elif instance.input_type == WarehouseTransferEntryInputType.LOT_OUTPUT:
#         # consume_lot_output_in_lot_input(instance)
#         pass


# def at_purchase_bill(instance: PurchaseBill):
#     if purchase_order := instance.purchase_order:
#         for grn in purchase_order.goodsreceiptnote_set.all():
#             line_item: GrnLineItem
#             for line_item in grn.grnlineitem_set.all():
#                 line_item.purchase_bill = instance
#                 line_item.save()


# # Pre-save
# def at_grn_line_item(instance: GrnLineItem):
#     if instance.goods_receipt_note.purchase_order:
#         old_quantity = 0
#         try:
#             old_grnlineitem = GrnLineItem.objects.get(id=instance.id)
#             old_quantity = old_grnlineitem.quantity
#         except GrnLineItem.DoesNotExist:
#             pass

#         purchase_order_item: PurchaseOrderItem = instance.purchase_order_item
#         used_quantity = sum(
#             [
#                 line_item.quantity
#                 for line_item in purchase_order_item.grnlineitem_set.all()
#             ]
#         )
#         available_quantity = (
#             purchase_order_item.quantity - used_quantity + old_quantity
#         )
#         if instance.quantity > available_quantity:
#             raise ValidationError(
#                 {"quantity": "Not enough quantity left from purchase order"}
#             )
