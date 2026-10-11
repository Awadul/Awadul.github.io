"""Conservative, explainable gate; only visitor statements count."""
import re


def brief_ready(statements: list[str]) -> bool:
    if len(statements) < 3:
        return False
    content = "\n".join(statements).lower()
    if len(content.strip()) < 180:
        return False
    direct_request = re.search(
        r"\b(?:i|we)\s+(?:need|want|would like|am looking for|are looking for)\b.{0,100}"
        r"\b(?:website|app|application|platform|crm|dashboard|automation|chatbot|system|software|integration|tool)\b",
        content, re.DOTALL,
    )
    # A supplied specification is also project intent; visitors need not say
    # "I need an app" before describing the application they want built.
    supplied_brief = any(
        re.search(r"(?:^|\n)\s*(?:the\s+)?(?:idea\s*\(project brief\)|project brief|my project|our project|project idea)\s*[:\-]", statement, re.I)
        and re.search(r"\b(?:saas|website|app|application|platform|crm|dashboard|automation|chatbot|software)\b", statement, re.I)
        for statement in statements
    )
    # Require two independent kinds of detail, not just a long conversation.
    groups = [
        r"\b(?:customers?|clients?|staff|team|business|company|store|clinic|freight|students?|users?)\b",
        r"\b(?:manage|track|schedule|booking|payments?|reports?|inventory|upload|search|notifications?|invoices?)\b",
        r"\b(?:integrate|integration|connect|stripe|whatsapp|odoo|shopify|api|gmail)\b",
        r"\b(?:budget|deadline|weeks?|months?|launch|usd|pkr)\b",
    ]
    return bool(direct_request or supplied_brief) and sum(bool(re.search(pattern, content)) for pattern in groups) >= 2
