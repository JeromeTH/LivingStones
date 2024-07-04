import jwt

# Example JWT token (replace with your actual token)
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwMTQ2NDgxLCJpYXQiOjE3MjAwNjAwODEsImp0aSI6Ijc5OGM0ZmQ2MjRkZTRmNDlhMWU4NWRhMzY2ZDU1MDc2IiwidXNlcl9pZCI6MX0.pgX9QObhFBLmzuc0deP29_RabMwkPOS-f6D6ftfl_Ts'
# Decode the token without verifying the signature
decoded_token = jwt.decode(token, options={"verify_signature": False})

# Print the decoded token
print(decoded_token)

# Check the 'exp' claim
if 'exp' in decoded_token:
    exp_timestamp = decoded_token['exp']
    from datetime import datetime

    # Convert the timestamp to a datetime object
    exp_datetime = datetime.utcfromtimestamp(exp_timestamp)
    print(f"Token expires at: {exp_datetime}")
else:
    print("The 'exp' claim is not present in the token.")
