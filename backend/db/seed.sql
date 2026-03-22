INSERT INTO users (id, name, email, password_hash)
VALUES
  (1, 'Test Consumer', 'consumer@example.com', '$2a$10$Gbhd4FIBpk7PHHf0hEdJz.WudIE9tFFBl2b10BA0XEIUDF6EFgW7K')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO consumer_dashboard (user_id, meter_number, balance, due_amount, due_date, last_communication, monthly_usage, avg_daily_usage, peak_usage)
VALUES
  (
    1,
    'MTR-000001',
    1450.75,
    280.40,
    DATE_ADD(CURDATE(), INTERVAL 6 DAY),
    NOW(),
    JSON_ARRAY(
      JSON_OBJECT('label', 'Jan', 'value', 210),
      JSON_OBJECT('label', 'Feb', 'value', 225),
      JSON_OBJECT('label', 'Mar', 'value', 240),
      JSON_OBJECT('label', 'Apr', 'value', 232)
    ),
    7.8,
    12.4
  )
ON DUPLICATE KEY UPDATE meter_number = VALUES(meter_number);

INSERT INTO alerts (user_id, meter_serial_number, consumer_name, message)
VALUES
  (1, 'MTR-000001', 'Test Consumer', 'Bill due in 6 days'),
  (1, 'MTR-000001', 'Test Consumer', 'Low balance threshold reached'),
  (1, 'MTR-000001', 'Test Consumer', 'High peak usage detected');

INSERT INTO notifications (user_id, type, title, description)
VALUES
  (1, 'BILL_DUE', 'Bill Due Reminder', 'Your electricity bill payment is due this week.'),
  (1, 'PAYMENT_CONFIRMATION', 'Payment Confirmation', 'Your last payment has been received successfully.'),
  (1, 'LOW_BALANCE', 'Low Balance Alert', 'Your balance is below the recommended threshold.'),
  (1, 'SYSTEM_ALERT', 'System Alert', 'Scheduled meter maintenance completed.'),
  (1, 'TICKET_UPDATE', 'Ticket Update', 'Your support ticket has moved to in-progress status.');
