<?php

$email = $_POST["email"];
$name = $_POST["name"];
$phone = $_POST["phone"];
$message = $_POST["message"];

$host = "localhost";
$dbname = "ohwgie_contact_db";
$username = "root";
$password = "";

$conn = mysqli_connect($host, $username, $password, $dbname);

if (mysqli_connect_errno()) {
    die("Connection error: " . mysqli_connect_error());
}

$sql = "INSERT INTO message (email, name, phone, body)
        VALUES (?, ?, ?, ?)";

$stmt = mysqli_stmt_init($conn);

if ( ! mysqli_stmt_prepare($stmt, $sql)) {
    die(mysqli_error($conn));
}

mysqli_stmt_bind_param($stmt, "ssss",
                        $email,
                        $name,
                        $phone,
                        $message);

mysqli_stmt_execute($stmt);

echo "Record saved.";