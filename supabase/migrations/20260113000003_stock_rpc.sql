-- Migration: 20260113000003_stock_rpc
-- Description: RPC function for atomic stock decrement

CREATE OR REPLACE FUNCTION decrement_stock(variant_id UUID, qty INT)
RETURNS VOID AS $$
BEGIN
    UPDATE product_variants
    SET stock_quantity = stock_quantity - qty
    WHERE id = variant_id AND stock_quantity >= qty;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient stock for variant %', variant_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
