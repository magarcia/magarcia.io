---
title: "A Comprehensive Guide to DMARC: Ensuring Email Integrity and Trust"
date: "2023-09-11"
spoiler: When building a digital project, ensuring your emails land safely and are trusted is paramount. But how do you navigate the maze of email security? Enter DMARC. Alongside its companions, SPF and DKIM, we delve deep into establishing email integrity and combating threats like email spoofing and phishing.
tags:
  - buildinpublic
  - learninpublic
---

In the early days of developing [Voices.ink](https://voices.ink/), a collaborative project with [@Ester Martí](https://github.com/estermv) that effortlessly transcribes voice notes into your Notion account, I faced a common doubt. How could I ensure that our transactional emails wouldn’t end up lost in the void of spam folders or worse, be weaponized for phishing? My research for a secure and trustworthy email environment led me to DMARC.

In an age where email forms the backbone of professional communication, its security vulnerabilities are startling. Cyber attackers and fraudulent entities are constantly on the prowl, using sophisticated techniques to deceive through email spoofing and phishing. As email fraud escalates, the need for a robust solution becomes imperative. Enter DMARC — an advanced email protocol that promises to restore trust in our inboxes.

### **Why Do We Need DMARC?**

Email's inherent vulnerabilities make it susceptible to domain impersonation, where attackers send emails pretending to be from trusted sources. While solutions like SPF (Sender Policy Framework) and DKIM (DomainKeys Identified Mail) were introduced to counter these threats, they weren’t foolproof. DMARC (Domain-based Message Authentication, Reporting & Conformance) fills this gap by building upon and leveraging the strengths of both SPF and DKIM.

### **Understanding DMARC's Significance**

DMARC serves three main purposes:

1. **Authentication**: Ensuring that an email claiming to be from a specific domain genuinely originates from that domain.
2. **Reporting**: Enabling domain recipients to report back to the sender about DMARC evaluation results, thereby offering insights into potential issues.
3. **Policy Enforcement**: Granting domain owners the power to specify how unauthenticated emails should be handled.

![How DEMARC Works Diagram](https://www.globalcyberalliance.org/wp-content/uploads/GCA-DMARC-Resource-Kit-Infographic-update@2x@0.5x.png)
_Image Credit: Global Cyber Alliance_

### **The Building Blocks of DMARC: SPF & DKIM**

**SPF** verifies that the email's sending server has the domain owner's authorization. It uses a specific TXT record in the DNS, like:

`v=spf1 ip4:192.0.2.0/24 ip4:198.51.100.123 a:mail.example.com -all`

This record essentially says, "Only the IP range 192.0.2.0 to 192.0.2.255 and 198.51.100.123 are authorized to send emails for my domain."

**Explanation**:

- `v=spf1`: This indicates the version of SPF being used, which is SPF version 1.
- `ip4:192.0.2.0/24`: Authorizes the IP range 192.0.2.0 to 192.0.2.255 to send emails for the domain.
- `ip4:198.51.100.123`: Authorizes the specific IP address 198.51.100.123.
- `a:mail.example.com`: Authorizes the IP address resolved from the domain name mail.example.com.
- `-all`: Specifies that no other hosts are allowed to send emails. (The '-' is a hard fail, meaning emails from other sources should be rejected. `~all` would be a soft fail, suggesting they should be accepted but marked.)

**DKIM**, on the other hand, ensures the email's integrity by using cryptographic signatures. A typical DKIM TXT DNS record might look like:

`v=DKIM1; p=MIGfMA0GCSqG...`

This record holds the public key used by receiving servers to decrypt the email's DKIM signature and verify its authenticity.

The record's name typically includes a selector prefix, allowing the domain to have multiple DKIM keys. When sending an email, the server will mention which selector it's using, guiding the receiving server to the right DNS record.

**Explanation**:

- `v=DKIM1`: This signifies the version of DKIM being used.
- `p=`: This is the public key that receiving servers use to decrypt the DKIM signature in the email header. The actual key would be a long string (truncated in the example).

### **DMARC in Action**

When DMARC is implemented, domain owners publish a DMARC policy in their TXT DNS records (using the name `_dmarc`), such as:

`v=DMARC1; p=reject; rua=mailto:reports@example.com; ruf=mailto:forensic@example.com; pct=100; aspf=r; adkim=r`

This record translates to: "If an email fails DMARC authentication, reject it. And send aggregate DMARC reports to [reports@example.com](mailto:reports@example.com)."

**Explanation**:

- `v=DMARC1`: Indicates the DMARC version.
- `p=reject`: Policy to apply to emails that fail DMARC. Other values can be `none` or `quarantine`.
- `rua=mailto:reports@example.com`: Address where aggregate DMARC reports should be sent.
- `ruf=mailto:forensic@example.com`: Address where forensic (detailed) DMARC reports should be sent.
- `pct=100`: Percentage of emails to which the DMARC policy should be applied.
- `aspf=r`: SPF alignment mode. 'r' means relaxed (default), while 's' stands for strict.
- `adkim=r`: DKIM alignment mode. 'r' is for relaxed, and 's' is for strict.

Once an email is received, the receiving server validates it against SPF and DKIM. For DMARC to pass, at least one of these, SPF or DKIM, must be valid and aligned with the claimed domain. Emails failing this check are dealt with according to the DMARC policy — they might be rejected, quarantined, or let through with no action.

### **The Takeaway**

With the rise in sophisticated phishing attacks and the paramount importance of trust in digital communication, DMARC is more than just an advanced email security protocol. It's a beacon of trust, ensuring that genuine emails see the light of day while malicious ones lurk in the shadows. For organizations and individuals alike, understanding and implementing DMARC is a step towards a safer, more trustworthy digital communication landscape.

So, the next time you're looking at your email security measures, remember that DMARC isn't just an option — it's a necessity.

### **Further Resources and Tools**

For those who wish to dive deeper into DMARC and its intricacies, here are some valuable resources and tools:

- **DMARC Guide**: A comprehensive guide by the Global Cyber Alliance that covers the nuances of DMARC in detail. [Check it out here](https://www.globalcyberalliance.org/dmarc/).
- **DMARC Setup Checker**: An invaluable tool provided by the Global Cyber Alliance. It not only checks if your DMARC is set up correctly but also offers tips on rectifications if needed. [Try the tool here](https://dmarcguide.globalcyberalliance.org/#/).
