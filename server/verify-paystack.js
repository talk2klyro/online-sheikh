// server/verify-paystack.js
// Run: node server/verify-paystack.js
// Requires: npm i express axios dotenv cors
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

if(!process.env.PAYSTACK_SECRET_KEY){
  console.warn('PAYSTACK_SECRET_KEY not set. See server/.env');
}

// Verify route
app.post('/api/verify-paystack', async (req, res) => {
  try {
    const { reference } = req.body;
    if(!reference) return res.status(400).json({error: 'reference required'});

    const resp = await axios.get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        Accept: 'application/json'
      }
    });

    // resp.data.status === 'success' indicates verified
    return res.json(resp.data);
  } catch(err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ error: 'Verification failed', detail: err?.response?.data || err.message });
  }
});

app.listen(PORT, ()=> console.log(`Paystack verify server running on ${PORT}`));
